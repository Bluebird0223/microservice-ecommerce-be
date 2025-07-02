
const { orderSchema } = require('../schemas/orderSchema');
const orderModel = require('../models/order.model');

// Controller for creating a order
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

// Controller for getting all order
exports.getOrdersById = async (req, res, next) => {
    try {

        let userId = '685c161es0'

        // const { userId } = req

        const orders = await orderModel.getOrdersByUserId(userId);
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders
        });
    } catch (error) {
        console.error("Error in orderController.js - getOrdersById:", error);
        next(error); // Pass error to the error handling middleware
    }
};

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

exports.getOrderByOrderId = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        // Fetch existing order
        const existingOrder = await orderModel.getOrdersByOrderId(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: 'order not found' });
        }
        res.status(200).json({
            message: 'Order retrieved successfully',
            existingOrder
        });
    } catch (error) {
        console.error("Error in orderController.js - getOrderById:", error);
        next(error);
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId, orderStatus } = req.body;

        if (!orderId && !orderStatus) {
            return res.status(400).json({
                status: "FAILED",
                message: 'Validation Error',
                details: error.details.map(x => x.message),
            });
        }

        // Fetch existing user
        const existingOrder = await orderModel.getOrdersByOrderId(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        let dataToUpdate = {
            orderId,
            orderStatus
        }

        const updated = await orderModel.updateOrder(dataToUpdate);
        return res.status(200).json({
            status: "SUCCESS",
            message: "Order updated successfully",
            updated
        });
    } catch (error) {
        console.error("Error in orderController.js - updateOrder:", error);
        next(error); // Pass error to the error handling middleware
    }
}