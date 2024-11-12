const { buildBadRequestError } = require('./global-exception-handler');
exports.validatePayload = function (schema, payload) {
    const result = schema.validate(payload, {
        allowUnknown: true
    });
    if (result.error) {
        let errors = result.error.details.map(p => ({
            message: p.message.replace('\"', "").replace('\"', ""),
            type: p.type
        }));
        return buildBadRequestError(
            message = '¡Ups! Error en la solicitud.',
            stackTrace = [],
            errors = errors
        );
    }
    return null;
}