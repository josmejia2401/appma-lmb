const josmejia2401js = require('josmejia2401-js');
exports.schema = josmejia2401js.joi.object({
    projectId: josmejia2401js.joi.string().max(20).required(),
    name: josmejia2401js.joi.string().max(100).required(),
    description: josmejia2401js.joi.string().max(1000).optional()
});

