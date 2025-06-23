const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.DB_URL;

const connectToDatabase = async () => {
    try {
        // Check if DB_URL is defined
        await mongoose.connect(DB_URL, { dbName: process.env.DB_NAME });
        console.log('Connected to the database 🎁🎁');
    } catch (error) {
        console.error('Error connecting to the database 😭:', error.message);
        process.exit(1); // Exit the application if unable to connect to the database
    }
};

// Function to disconnect from the database
const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from the database');
    } catch (error) {
        console.error('Error disconnecting from the database 😭:', error.message);
    }
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
};