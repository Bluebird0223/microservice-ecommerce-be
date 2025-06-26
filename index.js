const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const { connectToDatabase } = require("./DB/connect-db")
const routes = require("./routes/routes")
const createDynamoDBTable = require("./utils/helper/create-tables")
const { userTableSchema, categoryTableSchema, productTableSchema } = require("./schemas/tableSchemas")

// Load environment variables from .env file
dotenv.config()

const port = process.env.PORT || 3080

// create express app
const app = express()

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



// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err); // Log the error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({
        status: 'error',
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Show stack in dev
    });
});


// connect to database
connectToDatabase();


async function initializeDatabase() {
    try {
        await createDynamoDBTable(userTableSchema)
        await createDynamoDBTable(categoryTableSchema)
        await createDynamoDBTable(productTableSchema)
    } catch (error) {
        console.error('Failed to initialize:', error);
        // Depending on your deployment strategy, you might want to exit here
        // process.exit(1);
    }
}

initializeDatabase().then(() => {
    console.log('table created successfully');
});

// start server
app.listen(port, () => {
    try {
        console.log(`Server is Running 🧧🤯 on port ${port} ✨✨ `);
    } catch (error) {
        console.log(error)
    }
})