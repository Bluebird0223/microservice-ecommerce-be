const Joi = require('joi');

exports.categorySchema = Joi.object({
    categoryId: Joi.string().optional(),
    categoryName: Joi.string().required(),
    createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});