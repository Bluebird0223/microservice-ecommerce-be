
const { paymentSchema } = require('../schemas/paymentSchema');
const paymentModel = require('../models/payment.model');

// Controller for creating a order
exports.createPayment = async (req, res, next) => {
    try {
        // Extract data from request body
        const paymentDetails = req.body;

        //Validation
        const { error, value } = paymentSchema.validate(paymentDetails, { abortEarly: false, stripUnknown: true });
        if (error) {
            // Send specific validation errors
            return res.status(400).json({
                message: 'Validation Error',
                details: error.details.map(x => x.message)
            });
        }

        // Create the payment in DynamoDB via the model
        const newPayment = await paymentModel.createPayment(value);

        res.status(201).json({
            message: 'payment created successfully',
            newPayment
        });
    } catch (error) {
        console.error("Error in paymentController.js - createPayment:", error);
        next(error);
    }
};

// Controller for getting all payment
exports.getPaymentById = async (req, res, next) => {
    try {

        let userId = '685c161es0'

        // const { userId } = req

        const payment = await paymentModel.getPaymentByUserId(userId);
        res.status(200).json({
            message: 'Payment retrieved successfully',
            payment
        });
    } catch (error) {
        console.error("Error in orderController.js - getOrdersById:", error);
        next(error); // Pass error to the error handling middleware
    }
};

// // // Controller for updating a user
// // const updateCategory = async (req, res, next) => {
// //     try {

// //         const { categoryId, categoryName } = req.body;


// //         // Validate user data using Joi
// //         const { error, value } = categorySchema.validate({ categoryId, categoryName }, { abortEarly: false, stripUnknown: true });
// //         if (error) {
// //             return res.status(400).json({
// //                 status: "FAILED",
// //                 message: 'Validation Error',
// //                 details: error.details.map(x => x.message),
// //             });
// //         }

// //         // Fetch existing user
// //         const existingUser = await categoryModel.getCategoryById(value?.categoryId);
// //         if (!existingUser) {
// //             return res.status(404).json({ message: 'Category not found' });
// //         }

// //         const updated = await categoryModel.updateCategory(value);

// //         if (!updated) {
// //             return res.status(404).json({
// //                 status: 'FAILED',
// //                 message: 'Category not found.',
// //             });
// //         }

// //         return res.status(200).json({
// //             status: "SUCCESS",
// //             message: "Category updated successfully",
// //             updated
// //         });
// //     } catch (error) {
// //         console.error("Error in userController.js - updateCategory:", error);
// //         next(error); // Pass error to the error handling middleware
// //     }
// // };

// exports.getOrderByOrderId = async (req, res, next) => {
//     try {
//         const { orderId } = req.body;
//         // Fetch existing order
//         const existingOrder = await orderModel.getOrderByOrderId(orderId);
//         if (!existingOrder) {
//             return res.status(404).json({ message: 'order not found' });
//         }
//         res.status(200).json({
//             message: 'Order retrieved successfully',
//             existingOrder
//         });
//     } catch (error) {
//         console.error("Error in orderController.js - getOrderById:", error);
//         next(error);
//     }
// }