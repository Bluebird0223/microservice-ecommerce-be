
const express = require('express');
const categoryController = require('../controllers/category.controller');
const userAuthentication = require('../utils/middleware/auth');
const categoryRoutes = express.Router();

categoryRoutes.post('/create-category', userAuthentication, categoryController.createCategory);
categoryRoutes.get('/category', categoryController.getAllCategory);
categoryRoutes.post('/category-id', categoryController.getCategoryById);
categoryRoutes.put('/update-category', categoryController.updateCategory)

module.exports = categoryRoutes;