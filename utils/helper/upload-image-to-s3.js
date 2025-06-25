const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "microservice-ecommerce";
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

async function uploadProfilePictureToS3(folderPath, fileBuffer, mimetype) {
    const filename = `${folderPath}${uuidv4()}-${Date.now()}`; // Unique file name
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Returns the public URL of the uploaded object
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error(`Failed to upload profile picture: ${error.message}`);
    }
}
module.exports = uploadProfilePictureToS3;