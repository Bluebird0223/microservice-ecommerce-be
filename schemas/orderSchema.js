const Joi = require('joi');

exports.orderSchema = Joi.object({
    orderId: Joi.string().optional(),
    userId: Joi.string().required(),
    cartItems: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).required(),
    totalAmount: Joi.number().required(),
    paymentStatus: Joi.string().required(),
    orderStatus: Joi.string().required(),
    shippingAddress: Joi.string().required(),
    createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});
