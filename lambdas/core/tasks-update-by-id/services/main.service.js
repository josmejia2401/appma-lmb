const {
    logger,
    commonUtils,
    dynamoDBRepository,
    responseHandler,
    listValues,
    globalException,
    schemaValidator
} = require('josmejia2401-js');
const constants = require('../lib/constants');
const schema = require('../lib/schema');

exports.doAction = async function (event, _context) {
    const traceID = commonUtils.getTraceID(event.headers || {});
    try {
        logger.info({ message: JSON.stringify(event), requestId: traceID });
        if (event.pathParameters !== undefined && event.pathParameters !== null) {
            const pathParameters = event.pathParameters;
            const body = JSON.parse(event.body);
            const options = {
                requestId: traceID
            };
            const errorBadRequest = schemaValidator.validatePayload(schema.schema, body);
            if (errorBadRequest) {
                return errorBadRequest;
            }
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};
            let updateExpression = "SET ";

            if (body.name !== undefined && body.name !== null) {
                expressionAttributeNames["#name"] = "name";
                expressionAttributeValues[":name"] = { "S": body.name };
                updateExpression = `${updateExpression} #name=:name`;
            }
            if (body.description !== undefined && body.description !== null) {
                expressionAttributeNames["#description"] = "description";
                expressionAttributeValues[":description"] = { "S": body.description };
                updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #description=:description`;
            }
            if (body.status !== undefined && body.status !== null) {
                expressionAttributeNames["#status"] = "status";
                expressionAttributeValues[":status"] = { "N": `${listValues.findStatusById(body.status).id}` };
                updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #status=:status`;
            }
            if (body.logs !== undefined && body.logs != null) {
                const response = await dynamoDBRepository.getItem({
                    key: {
                        id: {
                            S: `${pathParameters.id}`
                        },
                        functionalityId: {
                            S: `${body.functionalityId}`
                        }
                    },
                    tableName: constants.TBL_PROJECTS
                }, options);
                if (body.logs.modifyItem !== undefined && body.logs.modifyItem !== null) {
                    const index = response.logs.L.findIndex(m => m.M.id.S === body.logs.modifyItem.id);
                    expressionAttributeNames["#logsName"] = "logs";
                    expressionAttributeValues[":logsValue"] = {
                        M: {
                            id: { S: `${body.logs.modifyItem.id}` },
                            comments: { S: `${body.logs.modifyItem.comments}` },
                            startDate: { S: `${body.logs.modifyItem.startDate}` },
                            endDate: { S: `${body.logs.modifyItem.endDate}` },
                            interruptionTime: { N: `${body.logs.modifyItem.interruptionTime}` },
                            deltaTime: { N: `${body.logs.modifyItem.deltaTime}` },
                            status: { N: `${body.logs.modifyItem.status}` },
                            phase: { N: `${body.logs.modifyItem.phase}` },
                        }
                    };
                    updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #logsName[${index}] = :logsValue`;
                } else if (body.logs.addItem !== undefined && body.logs.addItem !== null) {
                    expressionAttributeNames["#logsName"] = "logs";
                    expressionAttributeValues[":logsValue"] = {
                        L: [
                            {
                                M: {
                                    id: { S: `${commonUtils.buildUuid()}` },
                                    comments: { S: `${body.logs.addItem.comments}` },
                                    startDate: { S: `${body.logs.addItem.startDate}` },
                                    endDate: { S: `${body.logs.addItem.endDate}` },
                                    interruptionTime: { N: `${body.logs.addItem.interruptionTime}` },
                                    deltaTime: { N: `${body.logs.addItem.deltaTime}` },
                                    status: { N: `${body.logs.addItem.status}` },
                                    phase: { N: `${body.logs.addItem.phase}` },
                                    createdAt: { S: `${new Date().toISOString()}` },
                                }
                            }
                        ]
                    };
                    updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #logsName = list_append(#logsName, :logsValue)`;
                } else if (body.logs.deleteItem !== undefined && body.logs.deleteItem !== null) {
                    const index = response.logs.L.findIndex(m => m.M.id.S === body.logs.deleteItem.id);
                    expressionAttributeNames["#logsName"] = "logs";
                    updateExpression = `${updateExpression.length > 4 ? updateExpression + ', ' : ''} REMOVE #logsName[${index}]`;
                }
            }
            await dynamoDBRepository.updateItem({
                key: {
                    id: {
                        S: `${pathParameters.id}`
                    },
                    functionalityId: {
                        S: `${body.functionalityId}`
                    }
                },
                expressionAttributeNames:  Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
                expressionAttributeValues:  Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
                updateExpression: updateExpression,
                conditionExpression: undefined,
                filterExpression: "attribute_exists(functionalityId)",
                tableName: constants.TBL_PROJECTS
            }, options);
            return responseHandler.successResponse(body);
        } else {
            return globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        logger.error({ message: err, requestId: traceID });
        return globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}