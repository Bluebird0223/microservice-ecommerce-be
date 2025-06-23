const categoryModel = require("../models/category.model");


exports.createCategory = async (req, res, next) => {
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
}