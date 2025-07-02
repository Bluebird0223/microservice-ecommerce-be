
const express = require('express');
const orderController = require('../controllers/order.controller');
const userAuthentication = require('../utils/middleware/auth');
const orderRoutes = express.Router();

orderRoutes.post('/create-order', orderController.createOrder);
orderRoutes.get('/orders', orderController.getOrdersById);
orderRoutes.post('/order-id', orderController.getOrderByOrderId);
orderRoutes.post('/update-order-status', orderController.updateOrderStatus);
// orderRoutes.put('/update-category', categoryController.updateCategory)

module.exports = orderRoutes;