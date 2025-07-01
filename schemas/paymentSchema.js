const Joi = require('joi');

exports.paymentSchema = Joi.object({
    paymentId: Joi.string().optional(),
    orderId: Joi.string().required(),
    userId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    status: Joi.string().valid('pending', 'success', 'failed', 'refunded').required(),
    paymentMethod: Joi.string().required(),
    transactionId: Joi.string().optional(),
    createdAt: Joi.date().iso().default(() => new Date().toISOString()),
    updatedAt: Joi.date().iso().default(() => new Date().toISOString()),
});
