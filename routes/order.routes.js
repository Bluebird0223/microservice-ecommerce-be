
const express = require('express');
const orderController = require('../controllers/order.controller');
const userAuthentication = require('../utils/middleware/auth');
const orderRoutes = express.Router();

orderRoutes.post('/create-order', orderController.createOrder);
// orderRoutes.get('/category', categoryController.getAllCategory);
// orderRoutes.post('/category-id', categoryController.getCategoryById);
// orderRoutes.put('/update-category', categoryController.updateCategory)

module.exports = orderRoutes;