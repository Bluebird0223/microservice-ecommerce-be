// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
dotenv.config();

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});



const connectToDatabase = async () => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        if(!dynamodb) {
            throw new Error('DynamoDB client is not initialized');
        }
        // Check if the connection is successful
        // const params = {
        //     TableName: process.env.DYNAMODB_TABLE_NAME,
        //     Limit: 1 // Just to check if the table exists
        // };
        // await dynamodb.scan(params).promise();
        console.log('Connected to the DynamoDB database 🎁🎁');
    } catch (error) {
        console.error('Error connecting to the DynamoDB database 😭:', error)
        process.exit(1); // Exit the application if unable to connect to the database
    }
}

module.exports = { connectToDatabase }




// const DB_URL = process.env.DB_URL;

// const connectToDatabase = async () => {
//     try {
//         // Check if DB_URL is defined
//         await mongoose.connect(DB_URL, { dbName: process.env.DB_NAME });
//         console.log('Connected to the database 🎁🎁');
//     } catch (error) {
//         console.error('Error connecting to the database 😭:', error.message);
//         process.exit(1); // Exit the application if unable to connect to the database
//     }
// };

// // Function to disconnect from the database
// const disconnectFromDatabase = async () => {
//     try {
//         await mongoose.disconnect();
//         console.log('Disconnected from the database');
//     } catch (error) {
//         console.error('Error disconnecting from the database 😭:', error.message);
//     }
// };

// module.exports = {
//     connectToDatabase,
//     disconnectFromDatabase,
// };