const josmejia2401js = require('josmejia2401-js');
exports.schema = josmejia2401js.joi.object({
    name: josmejia2401js.joi.string().max(100).required(),
    description: josmejia2401js.joi.string().allow("").max(1000).optional(),
    status: josmejia2401js.joi.number().required(),
    projectId: josmejia2401js.joi.string().max(30).required(),
});
