const josmejia2401js = require('josmejia2401-js');
exports.schema = josmejia2401js.joi.object({
    functionalityId: josmejia2401js.joi.string().max(30).required(),
    name: josmejia2401js.joi.string().max(100).required(),
    description: josmejia2401js.joi.string().max(500).optional(),
    status: josmejia2401js.joi.number().required(),
});
