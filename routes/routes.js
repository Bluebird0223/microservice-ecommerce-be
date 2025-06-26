const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const usersRoutes = require("./users.routes");

const routes = require("express").Router();

routes.use("/users", usersRoutes)
routes.use("/category", categoryRoutes)
routes.use("/product", productRoutes)

module.exports = routes;