const usersRoutes = require("./users.routes");

const routes = require("express").Router();

routes.use("/users",usersRoutes)

module.exports = routes;