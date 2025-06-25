
const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryRoutes = express.Router();

categoryRoutes.post('/create-category', categoryController.createCategory);
categoryRoutes.get('/category', categoryController.getAllCategory);
// usersRoutes.post('/user-id', userController.getUserById);
// usersRoutes.put('/update-user', userController.updateUser)

module.exports = categoryRoutes;