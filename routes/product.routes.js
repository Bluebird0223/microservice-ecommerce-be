
const express = require('express');
const productController = require('../controllers/product.controller');
const userAuthentication = require('../utils/middleware/auth');
const productRoutes = express.Router();

productRoutes.post('/create-product', userAuthentication, productController.createProduct);
productRoutes.get('/product', productController.getAllProducts);
productRoutes.post('/product-id', productController.getProductById);
productRoutes.put('/update-product', productController.updateProduct)
productRoutes.delete('/product-id', productController.deleteProduct)

module.exports = productRoutes;
