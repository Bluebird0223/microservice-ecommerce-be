const Joi = require('joi');

exports.commonValidationSchema = Joi.object({
    id: Joi.string().required(),
});
