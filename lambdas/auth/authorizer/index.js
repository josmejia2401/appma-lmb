import { JWT, logger, commonUtils, dynamoDBRepository } from 'josmejia2401-js';
const constants = require('./utils/contants');

exports.handler = async (event) => {
    const traceId = commonUtils.getTraceID(event.headers || {});
    const response = {
        "isAuthorized": false,
        "context": {
            "traceID": traceId
        }
    };
    logger.info({ traceID: traceId, message: JSON.stringify(event) });
    try {
        const authorization = commonUtils.getAuthorization(event.headers);
        if (authorization && JWT.isValidToken(authorization)) {
            const tokenDecoded = JWT.decodeToken(authorization);
            const options = {
                requestId: traceId,
                schema: {
                    id: {
                        S: ''
                    },
                    accessToken: {
                        S: ''
                    },
                    userId: {
                        S: ''
                    },
                    createdAt: {
                        S: ''
                    }
                }
            };
            const resultData = await dynamoDBRepository.getItem({
                key: {
                    id: {
                        S: `${tokenDecoded.jti}`
                    }
                },
                projectionExpression: 'id, accessToken, userId, createdAt',
                tableName: constants.TBL_TOKEN
            }, options);

            if (resultData &&
                tokenDecoded.keyid === resultData.userId &&
                resultData.accessToken === JWT.getOnlyToken(authorization)) {
                response.isAuthorized = true;
            } else if (resultData && resultData.id) {
                await dynamoDBRepository.deleteItem({
                    key: {
                        id: {
                            S: resultData.id.S
                        }
                    },
                    tableName: constants.TBL_TOKEN
                }, options);
            }
        }
    } catch (err) {
        logger.error({ message: err, traceId: traceId });
    }
    logger.info({ traceID: traceId, message: JSON.stringify({ response: response }) });
    return response;
};