const { dynamodb, DYNAMODB_CATEGORY_TABLE } = require('../config/aws');
const uniqId = require("short-unique-id")
const uid = new uniqId();

// Function to create a category
exports.createCategory = async (categoryData) => {
    try {
        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
            Item: {
                ...categoryData,
                categoryId: categoryData.categoryId || uid.stamp(10),
                createdAt: categoryData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        };

        await dynamodb.put(params).promise();
        console.log('category created in DynamoDB:', params.Item.categoryId);
        return params.Item;
    } catch (error) {
        console.error("Error in models/categoryModel.js - createCategory:", error);
        throw error;
    }
}
exports.getCategoryByName = async (categoryname) => {
    try {
        // Extract the string value from the object
        if (typeof categoryname === 'object' && categoryname !== null && 'categoryName' in categoryname) {

            categoryNameAsString = categoryname?.categoryName;
        } else if (typeof categoryname === 'string') {
            categoryNameAsString = categoryname;
        }

        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
            FilterExpression: 'categoryName = :categoryVal',
            ExpressionAttributeValues: {
                ':categoryVal': categoryNameAsString
            }
        };
        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/categoryModel.js - getCategoryByName:", error);
        throw error; // Re-throw the error for upstream handling
    }
}
exports.getCategoryById = async (categoryId) => {
    try {
        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
            FilterExpression: 'categoryId = :categoryVal',
            ExpressionAttributeValues: {
                ':categoryVal': categoryId
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/categoryModel.js - getCategoryById:", error);
        throw error; // Re-throw the error for upstream handling
    }
}

// Function to get all category
exports.getAllCategory = async () => {
    try {
        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
        };
        const result = await dynamodb.scan(params).promise();
        console.log('Retrieved all category. Count:', result.Items.length);
        return result.Items;
    } catch (error) {
        console.error("Error in models/categoryModel.js - getAllCategory:", error);
        throw error;
    }
}

exports.updateCategory = async (updates) => {
    try {
        if (!updates?.categoryId) {
            throw new Error('categoryId is required for update');
        }

        const timestamp = new Date().toISOString();
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        const { categoryId, ...fieldsToUpdate } = updates;

        // Ensure updatedAt is not included in updates
        delete fieldsToUpdate.updatedAt;

        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = value;
        }

        // Always add updatedAt
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = timestamp;

        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
            Key: { categoryId },
            UpdateExpression: 'SET ' + updateExpression.join(', '),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };

        const result = await dynamodb.update(params).promise();
        console.log('Category updated:', result.Attributes);
        return result.Attributes;
    } catch (error) {
        console.error("Error in models/categoryModel.js - updateCategory:", error);
        throw error;
    }
};
