import {
    JWT,
    logger,
    commonUtils,
    dynamoDBRepository,
    responseHandler,
    globalException,
} from 'josmejia2401-js';
const constants = require('../lib/constants');
const schema = require('../lib/schema');

exports.doAction = async function (event, _context) {
    const traceID = commonUtils.getTraceID(event.headers || {});
    try {
        logger.info({ message: JSON.stringify(event), requestId: traceID });

        if (event.pathParameters !== undefined && event.pathParameters !== null) {
            const pathParameters = event.pathParameters;
            const authorization = commonUtils.getAuthorization(event.headers);
            const tokenDecoded = JWT.decodeToken(authorization);
            const options = {
                requestId: traceID
            };
            await dynamoDBRepository.deleteItem({
                key: {
                    id: {
                        S: `${pathParameters.id}`
                    },
                    userId: {
                        S: `${tokenDecoded?.keyid}`
                    }
                },
                tableName: constants.TBL_PROJECTS
            }, options);
            return responseHandler.successResponse(pathParameters);
        } else {
            return globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        logger.error({ message: err, requestId: traceID });
        return globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}