const Joi = require('joi');

exports.cartSchema = Joi.object({
    cartId: Joi.string().optional(),
    userId: Joi.string().required(),
    cartItems: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).required()
});
