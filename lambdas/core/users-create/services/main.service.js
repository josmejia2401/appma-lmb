const {
    JWT,
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
        if (event.body !== undefined && event.body !== null) {
            const body = JSON.parse(event.body);
            const id = commonUtils.buildUuid();
            logger.info({
                requestId: traceID,
            });

            const errorBadRequest = schemaValidator.validatePayload(schema.schema, body);
            if (errorBadRequest) {
                return errorBadRequest;
            }
            const options = {
                requestId: traceID,
                schema: undefined
            };
            const usernameExists = await dynamoDBRepository.scan({
                tableName: constants.TBL_USERS,
                expressionAttributeValues: {
                    ":username": {
                        "S": `${body.username}`
                    },
                },
                expressionAttributeNames: {
                    "#username": "username"
                },
                projectionExpression: undefined,
                filterExpression: '#username=:username',
                limit: 1,
                lastEvaluatedKey: undefined,
            }, options);
            if (usernameExists.results.length > 0) {
                return globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Usuario invalido.');
            }
            const response = await dynamoDBRepository.putItem({
                tableName: constants.TBL_USERS,
                item: {
                    id: { S: `${id}` },
                    firstName: { S: `${body.firstName}` },
                    lastName: { S: `${body.lastName}` },
                    email: { S: `${body.email}` },
                    username: { S: `${body.username}` },
                    password: { S: `${body.password}` },
                    status: { N: `${listValues.findStatusById(1).id}` },
                    createdAt: { S: `${new Date().toISOString()}` }
                }
            }, options);
            return responseHandler.successResponse({
                id: response.id.S,
                firstName: response.firstName.S,
                lastName: response.lastName.S,
                email: response.email.S,
                username: response.username.S,
                password: response.password.S,
                status: Number(response.status.N),
                createdAt: response.createdAt.S
            });
        } else {
            return globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        logger.error({ message: err, requestId: traceID });
        return globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}