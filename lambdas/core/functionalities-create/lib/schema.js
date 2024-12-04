const josmejia2401js = require('josmejia2401-js');
exports.schema = josmejia2401js.joi.object({
    projectId: josmejia2401js.joi.string().max(20).required(),
    name: josmejia2401js.joi.string().max(100).required(),
    description: josmejia2401js.joi.string().allow("").max(1000).optional(),
    languages: josmejia2401js.joi.array().items(josmejia2401js.joi.object({
        id: josmejia2401js.joi.string(),
    })).optional(),
    technologies: josmejia2401js.joi.array().items(josmejia2401js.joi.object({
        id: josmejia2401js.joi.string(),
    })).optional()
});

