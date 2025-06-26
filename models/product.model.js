const { dynamodb, DYNAMODB_PRODUCT_TABLE } = require('../config/aws');
const productSchema = require('../schemas/productSchema');
const uniqId = require("short-unique-id")

const uid = new uniqId({ length: 10 });

// Function to create a product
exports.createProduct = async (productData, userId) => {
    try {
        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
            Item: {
                ...productData, // Use the data provided (assumed validated by controller)
                productId: productData.productId || uid.stamp(10), // Generate ID if not provided
                createdAt: productData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(), // Always update updatedAt on creation
                createdBy: userId
            }
        };

        await dynamodb.put(params).promise();
        console.log('Product created in DynamoDB:', params.Item.productId);
        return params.Item;
    } catch (error) {
        console.error("Error in models/productModel.js - createProduct:", error);
        throw error;
    }
}

// get product by name
exports.getProductByName = async (productName) => {
    try {
        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
            FilterExpression: 'productName = :nameVal',
            ExpressionAttributeValues: {
                ':nameVal': productName
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/productModel.js - getProductByName:", error);
        throw error; // Re-throw the error for upstream handling
    }
}


// Function to get all products
exports.getAllProducts = async () => {
    try {
        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
        };
        const result = await dynamodb.scan(params).promise();
        return result.Items;
    } catch (error) {
        console.error("Error in models/productModel.js - getAllProducts:", error);
        throw error;
    }
}


exports.getProductById = async (productId) => {
    try {
        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
            FilterExpression: 'productId = :IdVal',
            ExpressionAttributeValues: {
                ':IdVal': productId
            }
        };

        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/productModel.js - getProductById:", error);
        throw error; // Re-throw the error for upstream handling
    }
}

// async function getUserByName(username) {
//     try {
//         const params = {
//             TableName: DYNAMODB_USERS_TABLE,
//             FilterExpression: 'username = :userNameVal',
//             ExpressionAttributeValues: {
//                 ':userNameVal': username
//             }
//         };

//         const result = await dynamodb.scan(params).promise();
//         return result.Items.length > 0 ? result.Items[0] : null;
//     } catch (error) {
//         console.error("Error in models/userModel.js - getUserByName:", error);
//         throw error; // Re-throw the error for upstream handling
//     }
// }

// Function to update a user (simplified example for profile picture update)
exports.updateProduct = async (updateData) => {
    try {
        const productId = updateData?.productId
        const { error } = productSchema.validate(updateData, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new Error(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
        }

        const Item = {
            ...updateData,
            updatedAt: new Date().toISOString(),
        };

        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
            key: { productId },
            Item: Item,
            UpdateExpression: "set #name = :name, updatedAt = :updatedAt",
            ReturnValues: "ALL_OLD"
        };

        await dynamodb.put(params).promise();
        console.log('Product updated in DynamoDB:', productId);
        return Item; // Return the updated item
    } catch (error) {
        console.error("Error in models/productModel.js - updateProduct:", error);
        throw error;
    }
}

exports.deleteProduct = async (productId) => {
    try {
        if (!productId) {
            throw new Error("Product ID is required to delete a product.");
        }
        const params = {
            TableName: DYNAMODB_PRODUCT_TABLE,
            Key: { 'productId': productId },
            ReturnValues: "ALL_OLD"
        };

        const result = await dynamodb.delete(params).promise();
        return result.Attributes;
    } catch (error) {
        console.error("Error in models/productModel.js - deleteProduct:", error);
        throw error; // Re-throw the error for upstream handling
    }
}
