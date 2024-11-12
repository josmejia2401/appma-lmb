import {
    JWT,
    logger,
    commonUtils,
    dynamoDBRepository,
    responseHandler,
    listValues,
    globalException,
    schemaValidator
} from 'josmejia2401-js';
const constants = require('../lib/constants');
const schema = require('../lib/schema');

exports.doAction = async function (event, _context) {
    const traceID = commonUtils.getTraceID(event.headers || {});
    try {
        if (event.body !== undefined && event.body !== null) {
            const body = JSON.parse(event.body);
            const headers = event.headers;
            const authorization = commonUtils.getAuthorization(headers);
            const tokenDecoded = JWT.decodeToken(authorization);
            const id = commonUtils.buildUuid();
            logger.info({
                requestId: traceID,
                message: JSON.stringify(tokenDecoded)
            });

            const errorBadRequest = schemaValidator.validatePayload(schema, body);
            if (errorBadRequest) {
                return errorBadRequest;
            }
            const options = {
                requestId: traceID,
                schema: undefined
            };
            const response = await dynamoDBRepository.putItem({
                tableName: constants.TBL_PROJECTS,
                item: {
                    id: { S: `${id}` },
                    userId: { S: `${tokenDecoded?.keyid}` },
                    name: { S: `${body.name}` },
                    description: { S: `${body.description}` },
                    status: { N: `${listValues.findStatusById(1).id}` },
                    createdAt: { S: `${new Date().toISOString()}` }
                }
            }, options);
            return responseHandler.successResponse({
                id: response.id.S,
                name: response.name.S,
                description: response.description.S,
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