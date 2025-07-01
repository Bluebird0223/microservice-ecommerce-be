
const express = require('express');
const userController = require('../controllers/user.controller');
const usersRoutes = express.Router();

usersRoutes.post('/create-users', userController.createUser);
usersRoutes.get('/users', userController.getAllUsers);
usersRoutes.post('/user-id', userController.getUserById);
usersRoutes.put('/update-user', userController.updateUser)

// admin
usersRoutes.post('/login',userController.loginUser)

// public
usersRoutes.post('/public-login',userController.publicLogin)


module.exports = usersRoutes;