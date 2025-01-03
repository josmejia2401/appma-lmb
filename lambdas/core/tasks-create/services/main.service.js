const josmejia2401js = require('josmejia2401-js');
const constants = require('../lib/constants');
const schema = require('../lib/schema');

exports.doAction = async function (event, _context) {
    const traceID = josmejia2401js.commonUtils.getTraceID(event.headers || {});
    try {
        if (event.body !== undefined && event.body !== null) {
            const body = JSON.parse(event.body);
            const authorization = josmejia2401js.commonUtils.getAuthorization(event);
            const tokenDecoded = josmejia2401js.JWT.decodeToken(authorization);
            const id = josmejia2401js.commonUtils.buildUuid();
            josmejia2401js.logger.info({
                requestId: traceID,
                message: JSON.stringify(tokenDecoded)
            });

            const errorBadRequest = josmejia2401js.schemaValidator.validatePayload(schema.schema, body);
            if (errorBadRequest) {
                return errorBadRequest;
            }
            const options = {
                requestId: traceID,
                schema: undefined
            };
            const logs = [];
            if (body.logs && body.logs.length > 0) {
                body.logs.forEach(element => {
                    logs.push({
                        M: {
                            id: { S: `${josmejia2401js.commonUtils.buildUuid()}` },
                            comments: { S: `${element.comments}` },
                            startDate: { S: `${element.startDate}` },
                            endDate: { S: `${element.endDate}` },
                            interruptionTime: { N: `${element.interruptionTime}` },
                            deltaTime: { N: `${element.deltaTime}` },
                            status: { N: `${element.status}` },
                            phase: { N: `${element.phase}` },
                            createdAt: { S: `${new Date().toISOString()}` },
                        }
                    });
                });
            }

            const response = await josmejia2401js.dynamoDBRepository.putItem({
                tableName: constants.TBL_PROJECTS,
                item: {
                    id: { S: `${id}` },
                    userId: { S: `${tokenDecoded?.keyid}` },
                    functionalityId: { S: `${body.functionalityId}` },
                    name: { S: `${body.name}` },
                    description: { S: `${body.description}` },
                    status: { N: `${josmejia2401js.listValues.findStatusById(1).id}` },
                    createdAt: { S: `${new Date().toISOString()}` },
                    logs: {
                        L: logs
                    },
                    itemType: { N: `${body.itemType}` },
                }
            }, options);
            return josmejia2401js.responseHandler.successResponse({
                id: response.id.S,
                functionalityId: response.functionalityId.S,
                name: response.name.S,
                description: response.description.S,
                status: Number(response.status.N),
                createdAt: response.createdAt.S,
                logs: response.logs.L,
                itemType: response.itemType?.N,
            });
        } else {
            return josmejia2401js.globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        josmejia2401js.logger.error({ message: err, requestId: traceID });
        return josmejia2401js.globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}