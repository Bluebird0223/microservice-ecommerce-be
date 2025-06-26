const Joi = require('joi');

const productSchema = Joi.object({
    productId: Joi.string().optional(),
    categoryId: Joi.string().required(),
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    discountPrice: Joi.string().required(),
    productPicture: Joi.string().uri().optional().allow(null, ''),
    brand: Joi.string().required(),
    stockQuantity: Joi.number().integer().min(0).required(),

    warranty: Joi.string().required(),
    ratings: Joi.number().min(0).max(5).optional().allow(null),
    reviews: Joi.array().items(
        Joi.object({
            reviewId: Joi.string().optional(),
            userId: Joi.string().optional(),
            comment: Joi.string().optional(),
            rating: Joi.number().min(1).max(5).optional(),
            createdAt: Joi.date().iso().default(() => new Date().toISOString())
        })
    ).optional().allow(null),
    createdBy: Joi.string().optional().default('admin'),
    createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});

module.exports = productSchema;