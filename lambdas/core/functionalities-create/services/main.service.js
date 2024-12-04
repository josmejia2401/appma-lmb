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
            const technologies = [];
            const languages = [];

            if (body.technologies && body.technologies.length > 0) {
                body.technologies.forEach(element => {
                    technologies.push({
                        M: {
                            id: { S: `${element.id}` },
                        }
                    });
                });
            }

            if (body.languages && body.languages.length > 0) {
                body.languages.forEach(element => {
                    languages.push({
                        M: {
                            id: { S: `${element.id}` },
                        }
                    });
                });
            }

            const response = await josmejia2401js.dynamoDBRepository.putItem({
                tableName: constants.TBL_PROJECTS,
                item: {
                    id: { S: `${id}` },
                    userId: { S: `${tokenDecoded?.keyid}` },
                    projectId: { S: `${body.projectId}` },
                    name: { S: `${body.name}` },
                    description: { S: `${body.description}` },
                    status: { N: `${josmejia2401js.listValues.findStatusById(1).id}` },
                    createdAt: { S: `${new Date().toISOString()}` },
                    languages: {
                        L: languages
                    },
                    technologies: {
                        L: technologies
                    }
                }
            }, options);
            return josmejia2401js.responseHandler.successResponse({
                id: response.id.S,
                projectId: response.projectId.S,
                name: response.name.S,
                description: response.description.S,
                status: Number(response.status.N),
                createdAt: response.createdAt.S,
                languages: response.languages?.L.map(p => ({ id: p.M.id.S })),
                technologies: response.technologies?.L.map(p => ({ id: p.M.id.S }))
            });
        } else {
            return josmejia2401js.globalException.buildBadRequestError('Al parecer la solicitud no es correcta. Intenta nuevamente, por favor.');
        }
    } catch (err) {
        josmejia2401js.logger.error({ message: err, requestId: traceID });
        return josmejia2401js.globalException.buildInternalError("No pudimos realizar la solicitud. Intenta más tarde, por favor.")
    }
}