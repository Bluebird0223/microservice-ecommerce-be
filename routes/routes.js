const productRouter = require("./product.routes");

const routes = require("express").Router();

routes.use("/products", productRouter);

module.exports = routes;