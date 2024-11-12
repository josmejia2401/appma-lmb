const { joi } = require('josmejia2401-js');
exports.schema = joi.object({
    firstName: joi.string().max(100).required(),
    lastName: joi.string().max(100).required(),
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string().required()
});
