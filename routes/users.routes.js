
const express = require('express');
const userController = require('../controllers/user.controller');
const usersRoutes = express.Router();

usersRoutes.post('/create-users', userController.createUser);
usersRoutes.get('/users', userController.getAllUsers);
usersRoutes.post('/user-id', userController.getUserById);
usersRoutes.post('/update-user', userController.updateUser)

module.exports = usersRoutes;