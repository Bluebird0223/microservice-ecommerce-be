
const express = require('express');
const paymentController = require('../controllers/payment.controller');
const userAuthentication = require('../utils/middleware/auth');
const paymentRoutes = express.Router();

paymentRoutes.post('/create-payment', paymentController.createPayment);
paymentRoutes.post('/payment-id', paymentController.getPaymentById);
// paymentRoutes.get('/product', productController.getAllProducts);
// paymentRoutes.put('/update-product', productController.updateProduct)
// paymentRoutes.delete('/product-id', productController.deleteProduct)

module.exports = paymentRoutes;
