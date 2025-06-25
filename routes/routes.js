const categoryRoutes = require("./category.routes");
const usersRoutes = require("./users.routes");

const routes = require("express").Router();

routes.use("/users",usersRoutes)
routes.use("/category",categoryRoutes)

module.exports = routes;