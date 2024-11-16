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
        if (event.pathParameters !== undefined && event.pathParameters !== null) {
            const pathParameters = event.pathParameters;
            const authorization = commonUtils.getAuthorization(event);
            const tokenDecoded = JWT.decodeToken(authorization);
            const options = {
                requestId: traceID
            };
            const response = await dynamoDBRepository.getItem({
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
            if (!response) {
                return globalException.buildNotFoundError({});
            }
            const logs = [];
            if (response.logs.L.length > 0) {
                response.logs.L.map(m => ({
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
            return responseHandler.successResponse({
                id: response.id?.S,
                userId: response.userId?.S,
                functionalityId: response.functionalityId?.S,
                name: response.name?.S,
                description: response.description?.S,
                status: Number(response.status?.N),
                logs: logs,
                createdAt: response.createdAt?.S,
            });
        } else {
            return globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        logger.error({ message: err, requestId: traceID });
        return globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}