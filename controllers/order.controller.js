
const { orderSchema } = require('../schemas/orderSchema');
const orderModel = require('../models/order.model');

// Controller for creating a user
exports.createOrder = async (req, res, next) => {
    try {
        // Extract data from request body
        const orderDetails = req.body;

        //Validation
        const { error, value } = orderSchema.validate(orderDetails, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        // Create the order in DynamoDB via the model
        const newOrder = await orderModel.createOrder(value);

        res.status(201).json({
            message: 'order created successfully',
            newOrder
        });
    } catch (error) {
        console.error("Error in orderController.js - createOrder:", error);
        next(error);
    }
};

// Controller for getting all category
// const getAllCategory = async (req, res, next) => {
//     try {
//         const categories = await categoryModel.getAllCategory();
//         res.status(200).json({
//             message: 'Category retrieved successfully',
//             categories
//         });
//     } catch (error) {
//         console.error("Error in categoryController.js - getAllCategory:", error);
//         next(error); // Pass error to the error handling middleware
//     }
// };

// // Controller for updating a user
// const updateCategory = async (req, res, next) => {
//     try {

//         const { categoryId, categoryName } = req.body;


//         // Validate user data using Joi
//         const { error, value } = categorySchema.validate({ categoryId, categoryName }, { abortEarly: false, stripUnknown: true });
//         if (error) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: 'Validation Error',
//                 details: error.details.map(x => x.message),
//             });
//         }

//         // Fetch existing user
//         const existingUser = await categoryModel.getCategoryById(value?.categoryId);
//         if (!existingUser) {
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         const updated = await categoryModel.updateCategory(value);

//         if (!updated) {
//             return res.status(404).json({
//                 status: 'FAILED',
//                 message: 'Category not found.',
//             });
//         }

//         return res.status(200).json({
//             status: "SUCCESS",
//             message: "Category updated successfully",
//             updated
//         });
//     } catch (error) {
//         console.error("Error in userController.js - updateCategory:", error);
//         next(error); // Pass error to the error handling middleware
//     }
// };

// const getCategoryById = async (req, res, next) => {
//     try {
//         const { categoryId } = req.body;
//         // Fetch existing category
//         const existingCategory = await categoryModel.getCategoryById(categoryId);
//         if (!existingCategory) {
//             return res.status(404).json({ message: 'category not found' });
//         }
//         res.status(200).json({
//             message: 'Category retrieved successfully',
//             existingCategory
//         });

//     } catch (error) {
//         console.error("Error in categoryController.js - getCategoryById:", error);
//         next(error);
//     }
// }

// module.exports = {
//     createCategory,
//     getAllCategory,
//     getCategoryById,
//     updateCategory
// };