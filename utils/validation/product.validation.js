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
exports.updateUserValidation = Joi.object().keys({
    id: Joi.string().length(24).required(),
    name: Joi.string().optional().allow("", null).pattern(/^[a-zA-Z0-9 ]*$/).message("Name must not contain special characters"),
    employee_group: Joi.string().optional().allow("", null),
    designation: Joi.string().optional().allow("", null),
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).optional().allow("", null),
    tabAccess: Joi.array().min(1).items(
        Joi.object({
            tabName: Joi.string().optional(),
            access: Joi.string().valid("read", "write", "none").optional()
        })
    ).optional().allow("", null),
});
