
const express = require('express');
const cartController = require('../controllers/cart.controller');
const userAuthentication = require('../utils/middleware/auth');
const cartRoutes = express.Router();

cartRoutes.post('/add-to-cart', cartController.addToCart);
cartRoutes.get('/cart', cartController.getCart);
cartRoutes.put('/update-cart', cartController.updateCart)
cartRoutes.post('/remove-from-cart', cartController.removeFromCart);

module.exports = cartRoutes;