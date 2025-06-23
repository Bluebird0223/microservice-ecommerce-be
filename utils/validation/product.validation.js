const Joi = require("joi");

// create product
exports.createProductValidation = Joi.object().keys({
    name: Joi.string().pattern(/^[a-zA-Z0-9 ]*$/).message("Name must not contain special characters").required(),
    price: Joi.number().required(),
    cuttedPrice: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
});


// update user validation
exports.updateProductValidation = Joi.object().keys({
    id: Joi.string().length(24).required(),
    name: Joi.string().optional().allow("", null).pattern(/^[a-zA-Z0-9 ]*$/).message("Name must not contain special characters"),
    price: Joi.number().optional().allow("", null),
    cuttedPrice: Joi.number().optional().allow("", null),
    description: Joi.string().optional().allow("", null),
    category: Joi.string().optional().allow("", null),
});
