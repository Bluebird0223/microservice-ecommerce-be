const { dynamodb, s3, S3_BUCKET_NAME, S3_PROFILE_PICTURE_FOLDER, DYNAMODB_USERS_TABLE } = require('../config/aws');
const userSchema = require('../schemas/usersSchema');
const uniqId = require("short-unique-id")

const uid = new uniqId({ length: 10 });

// Function to create a user
async function createUser(userData) {
    try {
        // Joi validation is moved to the controller for direct client input validation
        // But for internal consistency or if calling this model directly,
        // you might want to keep a validation step here or in a service layer.
        // For now, assuming the controller sends validated data.

        const params = {
            TableName: DYNAMODB_USERS_TABLE,
            Item: {
                ...userData, // Use the data provided (assumed validated by controller)
                userId: userData.userId || uid.stamp(10), // Generate ID if not provided
                createdAt: userData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(), // Always update updatedAt on creation
            }
        };

        await dynamodb.put(params).promise();
        console.log('User created in DynamoDB:', params.Item.userId);
        return params.Item;
    } catch (error) {
        console.error("Error in models/userModel.js - createUser:", error);
        throw error;
    }
}
async function getUserByEmail(email) {
    try {
        const params = {
            TableName: DYNAMODB_USERS_TABLE,
            FilterExpression: 'email = :emailVal',
            ExpressionAttributeValues: {
                ':emailVal': email
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/userModel.js - getUserByEmail:", error);
        throw error; // Re-throw the error for upstream handling
    }
}
async function getUserById(userId) {
    try {
        const params = {
            TableName: DYNAMODB_USERS_TABLE,
            FilterExpression: 'userId = :userIdVal',
            ExpressionAttributeValues: {
                ':userIdVal': userId
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/userModel.js - getUserByEmail:", error);
        throw error; // Re-throw the error for upstream handling
    }
}

async function getUserByName(username) {
    try {
        const params = {
            TableName: DYNAMODB_USERS_TABLE,
            FilterExpression: 'username = :userNameVal',
            ExpressionAttributeValues: {
                ':userNameVal': username
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/userModel.js - getUserByName:", error);
        throw error; // Re-throw the error for upstream handling
    }
}


// Function to get all users
async function getAllUsers() {
    try {
        const params = {
            TableName: DYNAMODB_USERS_TABLE,
        };
        const result = await dynamodb.scan(params).promise();
        console.log('Retrieved all users. Count:', result.Items.length);
        return result.Items;
    } catch (error) {
        console.error("Error in models/userModel.js - getAllUsers:", error);
        throw error;
    }
}

// Function to update a user (simplified example for profile picture update)
async function updateUser(userId, updateData) {
    try {
        const { error } = userSchema.validate(updateData, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
        }

        const Item = {
            userId: userId,
            ...updateData,
            updatedAt: new Date().toISOString(),
        };

        const params = {
            TableName: DYNAMODB_USERS_TABLE,
            key: { userId },
            Item: Item,
            UpdateExpression: "set #name = :name, updatedAt = :updatedAt",
            ReturnValues: "ALL_OLD"
        };

        await dynamodb.put(params).promise();
        console.log('User updated in DynamoDB:', userId);
        return Item; // Return the updated item
    } catch (error) {
        console.error("Error in models/userModel.js - updateUser:", error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    getAllUsers,
    updateUser,
    getUserById,
    getUserByName
};