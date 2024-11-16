const {
    JWT,
    logger,
    commonUtils,
    dynamoDBRepository,
    responseHandler,
    globalException,
} = require('josmejia2401-js');
const constants = require('../lib/constants');
exports.doAction = async function (event, _context) {
    const traceID = commonUtils.getTraceID(event.headers || {});
    try {
        logger.info({ message: JSON.stringify(event), requestId: traceID });
        const queryStringParameters = event.queryStringParameters;
        const authorization = commonUtils.getAuthorization(event);
        const tokenDecoded = JWT.decodeToken(authorization);
        const options = {
            requestId: traceID
        };
        let filterExpression = '#userId=:userId';
        const expressionAttributeValues = {
            ":userId": {
                "S": `${tokenDecoded?.keyid}`
            }
        };
        const expressionAttributeNames = {
            "#userId": "userId"
        };
        if (queryStringParameters && queryStringParameters.name) {
            expressionAttributeValues[":name"] = {
                "S": queryStringParameters.name
            };
            expressionAttributeNames["#name"] = "name";
            filterExpression = `${filterExpression} AND contains(#name,:name)`;
        }
        if (queryStringParameters && queryStringParameters.description) {
            expressionAttributeValues[":description"] = {
                "S": queryStringParameters.description
            };
            expressionAttributeNames["#description"] = "description";
            filterExpression = `${filterExpression} AND contains(#description,:description)`;
        }
        if (queryStringParameters && queryStringParameters.status) {
            expressionAttributeValues[":status"] = {
                "N": `${queryStringParameters.status}`
            };
            expressionAttributeNames["#status"] = "status";
            filterExpression = `${filterExpression} AND #status=:status`;
        }

        let lastEvaluatedKey = undefined;
        if (queryStringParameters && queryStringParameters.userId && queryStringParameters.id) {
            lastEvaluatedKey = {
                userId: {
                    S: queryStringParameters.userId
                },
                id: {
                    S: queryStringParameters.id
                }
            }
        }
        const response = await dynamoDBRepository.scan({
            expressionAttributeValues: expressionAttributeValues,
            expressionAttributeNames: expressionAttributeNames,
            projectionExpression: undefined,
            filterExpression: filterExpression,
            limit: 10,
            lastEvaluatedKey: lastEvaluatedKey,
            tableName: constants.TBL_PROJECTS
        }, options);
        response.results = response.results.map(p => {
            let logs = [];
            if (p.logs.L.length > 0) {
                logs = p.logs.L.map(m => ({
                    id: m.M.id.S,
                    comments: m.M.comments.S,
                    startDate: m.M.startDate.S,
                    endDate: m.M.endDate.S,
                    interruptionTime: Number(m.M.interruptionTime.N),
                    deltaTime: Number(m.M.deltaTime.N),
                    status: Number(m.M.status.N),
                    phase: Number(m.M.phase.N),
                    createdAt: m.M.createdAt.S,
                }));
            }
            return {
                id: p.id?.S,
                userId: p.userId?.S,
                functionalityId: p.functionalityId?.S,
                name: p.name?.S,
                description: p.description?.S,
                status: Number(p.status?.N),
                logs: logs,
                createdAt: p.createdAt?.S,
            }
        });
        return responseHandler.successResponse(response);
    } catch (err) {
        logger.error({ message: err, requestId: traceID });
        return globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}