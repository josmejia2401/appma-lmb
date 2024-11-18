const {
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
            const options = {
                requestId: traceID
            };
            const response = await dynamoDBRepository.getItem({
                key: {
                    id: {
                        S: `${pathParameters.id}`
                    },
                    projectId: {
                        S: `${pathParameters.projectId}`
                    }
                },
                tableName: constants.TBL_PROJECTS
            }, options);
            if (!response) {
                return globalException.buildNotFoundError({});
            }
            return responseHandler.successResponse({
                id: response.id?.S,
                userId: response.userId?.S,
                projectId: response.projectId?.S,
                name: response.name?.S,
                description: response.description?.S,
                status: Number(response.status?.N),
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