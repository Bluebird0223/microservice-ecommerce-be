const Joi = require('joi');

const userSchema = Joi.object({
    userId: Joi.string().uuid().optional(),
    userType: Joi.string().optional().default('customer'),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string().optional().allow(null, ''),
    profilePicture: Joi.string().uri().optional().allow(null, ''),
    address: Joi.object({
        street: Joi.string().optional().allow('', null),
        city: Joi.string().optional().allow('', null),
        state: Joi.string().optional().allow('', null),
        zip: Joi.string().optional().allow('', null),
        country: Joi.string().optional().allow('', null)
    }).optional().allow(null),
    password: Joi.string().optional().default(null),
    createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});

module.exports = userSchema;