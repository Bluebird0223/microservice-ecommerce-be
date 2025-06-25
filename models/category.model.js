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
            categoryNameAsString = categoryname.categoryName;
        } else if (typeof categoryname === 'string') {
            categoryNameAsString = categoryname;
        }

        const params = {
            TableName: DYNAMODB_CATEGORY_TABLE,
            FilterExpression: 'categoryname = :categoryVal',
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
// async function getUserById(userId) {
//     try {
//         const params = {
//             TableName: DYNAMODB_USERS_TABLE,
//             FilterExpression: 'userId = :userIdVal',
//             ExpressionAttributeValues: {
//                 ':userIdVal': userId
//             }
//         };

//         const result = await dynamodb.scan(params).promise();
//         return result.Items.length > 0 ? result.Items[0] : null;
//     } catch (error) {
//         console.error("Error in models/userModel.js - getUserByEmail:", error);
//         throw error; // Re-throw the error for upstream handling
//     }
// }

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

// // Function to update a user (simplified example for profile picture update)
// async function updateUser(userId, updateData) {
//     try {
//         const { error } = userSchema.validate(updateData, { abortEarly: false, stripUnknown: true });
//         if (error) {
//             throw new Error(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
//         }

//         const Item = {
//             userId: userId,
//             ...updateData,
//             updatedAt: new Date().toISOString(),
//         };

//         const params = {
//             TableName: DYNAMODB_USERS_TABLE,
//             key: { userId },
//             Item: Item,
//             UpdateExpression: "set #name = :name, updatedAt = :updatedAt",
//             ReturnValues: "ALL_OLD"
//         };

//         await dynamodb.put(params).promise();
//         console.log('User updated in DynamoDB:', userId);
//         return Item; // Return the updated item
//     } catch (error) {
//         console.error("Error in models/userModel.js - updateUser:", error);
//         throw error;
//     }
// }
