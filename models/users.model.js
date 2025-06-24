const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),

    bio: Joi.string().optional().allow[null, ''],
    profilePicture: Joi.string().optional().allow[null, ''],
    address: Joi.object({
        street: Joi.string().optional().allow('', null),
        city: Joi.string().optional().allow('', null),
        state: Joi.string().optional().allow('', null),
        zip: Joi.string().optional().allow('', null),
        country: Joi.string().optional().allow('', null)
    }).optional(),
    
    createdAt: Joi.date().iso().default(() => new Date().toISOString()), // ISO string for dates
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});

module.exports = userSchema;