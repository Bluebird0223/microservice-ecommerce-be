const express = require("express")
const { createProduct } = require("../controllers/product.controller")
const { createCategory } = require("../controllers/category.controller")
// const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller")
const productRouter = express.Router()

// productRouter.route('/products-all').get(getAllProducts)
productRouter.route('/create-product').post(createProduct)


// category routes
productRouter.route('/create-category').post(createCategory)


module.exports = productRouter
