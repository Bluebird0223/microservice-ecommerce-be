const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const categoryModel = require("../models/category.model");
const ErrorHandler = require("../utils/helper/errorHandler");


exports.createCategory = asyncErrorHandler(async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        // Create new category
        const newCategory = {
            name,
            description,
        };

        // Simulate saving to database (replace with actual DB logic)
        const savedCategory = await categoryModel.create(newCategory);

        if (!savedCategory) {
            return res.status(500).json({ message: "Failed to create category" });
        }

        res.status(201).json({
            success: true,
            message: "Category created successfully",
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return next(new ErrorHandler("Failed to create category", 500));
    }
})

exports.getAllCategories = asyncErrorHandler(async (req, res, next) => {
    try {
        // Fetch all categories from the database
        const categories = await categoryModel.find({});

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return next(new ErrorHandler("Failed to fetch categories", 500));
    }
})

exports.getCategoryById = asyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Fetch category by ID
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return next(new ErrorHandler("Failed to fetch category", 500));
    }
})

exports.updateCategory = asyncErrorHandler(async (req, res, next) => {
    try {

        const { id, name, description } = req.body;

        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        // Validate input
        if (!name && !description) {
            return res.status(400).json({ success: false, message: "At least one field (name or description) is required for update" });
        }

        // check if category exist
        const isCategoryExist = await categoryModel.findById(id)
        if (!isCategoryExist) {
            return res.status(400).json({ success: false, message: "Category does not exist" });
        }

        // Update category
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return next(new ErrorHandler("Failed to update category", 500));
    }
})

exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Delete category
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return next(new ErrorHandler("Failed to delete category", 500));
    }
})