const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const productModel = require("../models/product.model");
const ErrorHandler = require("../utils/helper/errorHandler");
const { createProductValidation } = require("../utils/validation/product.validation");


exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    try {
        const { name, price, cuttedPrice, description, category } = req.body;

        //Validation
        const validationResult = await createProductValidation.validate({ name, price, cuttedPrice, description, category });
        if (validationResult?.error) {
            return next(new ErrorHandler(validationResult?.error?.details[0]?.message, 400))
        }

        // Create new product
        const newProduct = {
            name,
            price,
            cuttedPrice,
            description,
            category,
        };

        // Simulate saving to database (replace with actual DB logic)
        const savedProduct = await productModel.create(newProduct);

        if (!savedProduct) {
            return next(new ErrorHandler("Failed to create product", 500));
        }

        res.status(201).json({
            success: true,
            message: "Product created successfully",
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return next(new ErrorHandler("Failed to create product", 500));
    }
})