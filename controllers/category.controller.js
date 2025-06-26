
const { categorySchema } = require('../schemas/categorySchema');
const categoryModel = require('../models/category.model');

// Controller for creating a user
const createCategory = async (req, res, next) => {
    try {

        // Extract data from request body
        const categoryName = req.body;

        //Validation
        const { error, value } = categorySchema.validate(categoryName, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        //check if category already exist 
        const existingCategoryByName = await categoryModel.getCategoryByName(categoryName);
        if (existingCategoryByName) {
            return res.status(409).json({ // 409 Conflict is appropriate for resource conflict
                status: "FAILED",
                message: "Category with this Name already exists. Please use a different Name."
            });
        }

        // Create the category in DynamoDB via the model
        const newCategory = await categoryModel.createCategory(value);

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (error) {
        console.error("Error in categoryController.js - createCategory:", error);
        next(error);
    }
};

// Controller for getting all category
const getAllCategory = async (req, res, next) => {
    try {
        const categories = await categoryModel.getAllCategory();
        res.status(200).json({
            message: 'Category retrieved successfully',
            categories
        });
    } catch (error) {
        console.error("Error in categoryController.js - getAllCategory:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// Controller for updating a user
const updateCategory = async (req, res, next) => {
    try {

        const { categoryId, categoryName } = req.body;


        // Validate user data using Joi
        const { error, value } = categorySchema.validate({ categoryId, categoryName }, { abortEarly: false, stripUnknown: true });
        if (error) {
            return res.status(400).json({
                status: "FAILED",
                message: 'Validation Error',
                details: error.details.map(x => x.message),
            });
        }

        // Fetch existing user
        const existingUser = await categoryModel.getCategoryById(value?.categoryId);
        if (!existingUser) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updated = await categoryModel.updateCategory(value);

        if (!updated) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Category not found.',
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Category updated successfully",
            updated
        });
    } catch (error) {
        console.error("Error in userController.js - updateCategory:", error);
        next(error); // Pass error to the error handling middleware
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { categoryId } = req.body;
        // Fetch existing category
        const existingCategory = await categoryModel.getCategoryById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: 'category not found' });
        }
        res.status(200).json({
            message: 'Category retrieved successfully',
            existingCategory
        });

    } catch (error) {
        console.error("Error in categoryController.js - getCategoryById:", error);
        next(error);
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory
};