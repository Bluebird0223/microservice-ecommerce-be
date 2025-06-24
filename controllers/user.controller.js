const AWS = require('aws-sdk');
const userSchema = require('../schemas/userSchema'); // Import your schema

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users'; // Replace with your DynamoDB table name

// Function to create a user
async function createUser(userData) {
    try {
        // Validate incoming data against the schema
        const { error, value } = userSchema.validate(userData);
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
        }

        const params = {
            TableName: TABLE_NAME,
            Item: {
                ...value, // Use the validated and potentially defaulted value
                // DynamoDB does not have auto-incrementing IDs.
                // Generate a unique ID (e.g., UUID) if userId is not provided by the client.
                userId: value.userId || AWS.util.uuid.v4(),
                createdAt: value.createdAt || new Date().toISOString(),
                updatedAt: value.updatedAt || new Date().toISOString(),
            }
        };
        await dynamodb.put(params).promise();
        return params.Item;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

// Function to get a user by userId
async function getUserById(userId) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userId: userId
        }
    };
    try {
        const data = await dynamodb.get(params).promise();
        return data.Item;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

// Function to update a user
async function updateUser(userId, updates) {
    try {
        // You might want to validate 'updates' against a subset of your schema
        // or ensure only allowed fields are updated.
        const updateExpressionParts = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};
        let counter = 0;

        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                const attrName = `#attr${counter}`;
                const attrValue = `:value${counter}`;
                updateExpressionParts.push(`${attrName} = ${attrValue}`);
                expressionAttributeNames[attrName] = key;
                expressionAttributeValues[attrValue] = updates[key];
                counter++;
            }
        }

        if (updateExpressionParts.length === 0) {
            throw new Error("No update attributes provided.");
        }

        // Add updatedAt to ensure it's always updated
        const updatedAtKey = `#attr${counter}`;
        const updatedAtValue = `:value${counter}`;
        updateExpressionParts.push(`${updatedAtKey} = ${updatedAtValue}`);
        expressionAttributeNames[updatedAtKey] = 'updatedAt';
        expressionAttributeValues[updatedAtValue] = new Date().toISOString();

        const params = {
            TableName: TABLE_NAME,
            Key: { userId: userId },
            UpdateExpression: 'SET ' + updateExpressionParts.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: 'ALL_NEW' // Return the updated item
        };
        const data = await dynamodb.update(params).promise();
        return data.Attributes;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// Function to delete a user
async function deleteUser(userId) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userId: userId
        },
        ReturnValues: 'ALL_OLD' // Return the deleted item
    };
    try {
        const data = await dynamodb.delete(params).promise();
        return data.Attributes;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
};