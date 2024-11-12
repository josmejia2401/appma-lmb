import { joi } from 'josmejia2401-js';
export const schema = joi.object({
    name: joi.string().max(100).required(),
    description: joi.string().max(250).required(),
    status: joi.number().required(),
});
