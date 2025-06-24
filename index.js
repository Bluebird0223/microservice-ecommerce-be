const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const { connectToDatabase } = require("./DB/connect-db")
const routes = require("./routes/routes")
const createDynamoDBTable = require("./utils/helper/create-tables")


// const path = require("path");


const port = process.env.PORT || 3080

// create express app
const app = express()
dotenv.config()

// middlewares
app.use(cors({ origin: "*" }))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// all routes
app.use("/api", routes);

// default route
app.get("/", async (request, response) => {
    response.status(200).json({
        message: "e-commerce backend is live! 😁😁",
    });
});



//if routes not found
// app.get("*", function (request, response) {
//     response.status(404).json({ message: "Route not found" });
// });

// app.post("*", function (request, response) {
//     response.status(404).json({ message: "Route not found" });
// });

// error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message, stack: err.stack });
});


// connect to database
connectToDatabase();


async function initializeDatabase() {
    try {
        await createDynamoDBTable(userTableSchema);
        console.log('Database initialization for User Service complete.');
    } catch (error) {
        console.error('Failed to initialize database for User Service:', error);
        // Depending on your deployment strategy, you might want to exit here
        // process.exit(1);
    }
}

initializeDatabase().then(() => {
    console.log('user service table created successfully');
});

// start server
app.listen(port, () => {
    try {
        console.log(`Server is Running 🧧🤯 on port ${port} ✨✨ `);
    } catch (error) {
        console.log(error)
    }
})