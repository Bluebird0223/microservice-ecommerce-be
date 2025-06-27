const { dynamodb, DYNAMODB_CART_TABLE } = require('../config/aws');
const uniqId = require("short-unique-id")
const uid = new uniqId();

// Function to create a cart
exports.createCart = async (cartData) => {
    try {
        const params = {
            TableName: DYNAMODB_CART_TABLE,
            Item: {
                ...cartData,
                cartId: cartData.cartId || uid.stamp(10),
                createdAt: cartData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        };

        await dynamodb.put(params).promise();
        console.log('cart created in DynamoDB:', params.Item.cartId);
        return params.Item;
    } catch (error) {
        console.error("Error in models/cartModel.js - createCart:", error);
        throw error;
    }
}

exports.getCartByUserId = async (userId) => {
    try {
        // Extract the string value from the object
        // if (typeof userId === 'object' && userId !== null && 'userId' in userId) {

        //     userIdAsString = userId?.userId;
        // } else if (typeof userId === 'string') {
        //     categoryNameAsString = categoryname;
        // }

        const params = {
            TableName: DYNAMODB_CART_TABLE,
            FilterExpression: 'userId = :idVal',
            ExpressionAttributeValues: {
                ':idVal': userId
            }
        };
        const result = await dynamodb.scan(params).promise();
        return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
        console.error("Error in models/cartModel.js - getCartByUserId:", error);
        throw error; // Re-throw the error for upstream handling
    }
}
// exports.getCartByUserId = async (userId) => {
//     const params = {
//         TableName: DYNAMODB_CART_TABLE,
//         Key: { userId }
//     };
//     const result = await dynamodb.get(params).promise();
//     return result.Item || null;
// };

exports.updateCart = async (userId, cartItems) => {
  const updatedAt = new Date().toISOString();
  const params = {
    TableName: DYNAMODB_CART_TABLE,
    Key: { userId },
    UpdateExpression: 'SET cartItems = :items, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':items': cartItems,
      ':updatedAt': updatedAt
    },
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};
