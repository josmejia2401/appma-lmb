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

            if (body.technologies && body.technologies.length > 0) {
                const technologies = [];
                body.technologies.forEach(element => {
                    technologies.push({
                        M: {
                            id: { S: `${element.id}` },
                        }
                    });
                });
                expressionAttributeNames["#technologies"] = "technologies";
                expressionAttributeValues[":technologies"] = {
                    L: technologies
                }
                updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #technologies=:technologies`;
            }

            if (body.languages && body.languages.length > 0) {
                const languages = [];
                body.languages.forEach(element => {
                    languages.push({
                        M: {
                            id: { S: `${element.id}` },
                        }
                    });
                });
                expressionAttributeNames["#languages"] = "languages";
                expressionAttributeValues[":languages"] = {
                    L: languages
                }
                updateExpression = `${updateExpression} ${updateExpression.length > 4 ? ', ' : ' '} #languages=:languages`;
            }


            await dynamoDBRepository.updateItem({
                key: {
                    id: {
                        S: `${pathParameters.id}`
                    },
                    projectId: {
                        S: `${body.projectId}`
                    }
                },
                expressionAttributeNames: expressionAttributeNames,
                expressionAttributeValues: expressionAttributeValues,
                updateExpression: updateExpression,
                conditionExpression: undefined,
                filterExpression: "attribute_exists(userId)",
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