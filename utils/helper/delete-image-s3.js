const AWS = require('aws-sdk');
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3 = new AWS.S3();

/**
 * Delete a file from S3
 * @param {string} imageUrl - The full S3 public URL or the object key
 */
const deleteFromS3 = async (imageUrl) => {
    try {
        let key;

        // If it's a full URL, parse the pathname
        if (imageUrl.startsWith("http")) {
            const parsed = new URL(imageUrl);
            key = decodeURIComponent(parsed.pathname.substring(1)); // Remove leading slash
        } else {
            key = imageUrl;
        }

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: key,
        };

        await s3.deleteObject(params).promise();
        console.log(`Deleted file from S3: ${key}`);
    } catch (err) {
        console.error("Error deleting file from S3:", err);
        throw err;
    }
};

module.exports = deleteFromS3;
