const cartRoutes = require("./cart.routes");
const categoryRoutes = require("./category.routes");
const orderRoutes = require("./order.routes");
const paymentRoutes = require("./payment.routes");
const productRoutes = require("./product.routes");
const usersRoutes = require("./users.routes");

const routes = require("express").Router();

routes.use("/users", usersRoutes)
routes.use("/category", categoryRoutes)
routes.use("/product", productRoutes)
routes.use("/cart", cartRoutes)
routes.use("/order", orderRoutes)
routes.use("/payment", paymentRoutes)

module.exports = routes;