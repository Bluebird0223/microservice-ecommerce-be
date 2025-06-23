const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const productModel = require("../models/product.model");
const ErrorHandler = require("../utils/helper/errorHandler");
const { createProductValidation, updateProductValidation } = require("../utils/validation/product.validation");


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

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    try {
        // Fetch all products from the database
        const products = await productModel.find({});

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return next(new ErrorHandler("Failed to fetch products", 500));
    }
});

exports.getProductById = asyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id.length !== 24) {
            return next(new ErrorHandler("Invalid product ID", 400));
        }

        // Fetch product by ID from the database
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return next(new ErrorHandler("Failed to fetch product", 500));
    }
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    try {

        const { id, name, price, cuttedPrice, description, category } = req.body;

        // Validate ID format
        if (!id || id.length !== 24) {
            return next(new ErrorHandler("Invalid product ID", 400));
        }

        // Validate input
        const validationResult = await updateProductValidation.validate({ id, name, price, cuttedPrice, description, category });
        if (validationResult?.error) {
            return next(new ErrorHandler(validationResult?.error?.details[0]?.message, 400))
        }

        // Check if product exists
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            res.status(400).json({ success: true, message: "Product does not exist", })
        }


        // Update product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(id, {
            name,
            price,
            cuttedPrice,
            description,
            category,
        }, { new: true });

        if (!updatedProduct) {
            return next(new ErrorHandler("Failed to update product", 500));
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return next(new ErrorHandler("Failed to update product", 500));
    }
})

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || id.length !== 24) {
            return next(new ErrorHandler("Invalid product ID", 400));
        }

        // Delete product from the database
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return next(new ErrorHandler("Failed to delete product", 500));
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return next(new ErrorHandler("Failed to delete product", 500));
    }
})