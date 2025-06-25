const AWS = require('aws-sdk');

// Ensure environment variables are loaded (e.g., via dotenv.config() in app.js)
const AWS_REGION = process.env.AWS_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PROFILE_PICTURE_FOLDER = process.env.S3_PROFILE_PICTURE_FOLDER;
const S3_PRODUCT_IMAGE_FOLDER = process.env.S3_PRODUCT_IMAGE_FOLDER;
const DYNAMODB_USERS_TABLE = process.env.DYNAMODB_USERS_TABLE;
const DYNAMODB_CATEGORY_TABLE = process.env.DYNAMODB_CATEGORY_TABLE;

// Configure AWS SDK
AWS.config.update({
    region: AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // For production, prefer IAM roles over hardcoding keys
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports = {
    dynamodb,
    s3,
    S3_BUCKET_NAME,
    S3_PROFILE_PICTURE_FOLDER,
    S3_PRODUCT_IMAGE_FOLDER,
    DYNAMODB_USERS_TABLE,
    DYNAMODB_CATEGORY_TABLE
};