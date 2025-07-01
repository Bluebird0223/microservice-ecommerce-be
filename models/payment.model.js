
const { dynamodb, DYNAMODB_PAYMENT_TABLE } = require('../config/aws');
const uniqId = require("short-unique-id")
const uid = new uniqId();


exports.createPayment = async (paymentData) => {
    const params = {
        TableName: DYNAMODB_PAYMENT_TABLE,
        Item: {
            ...paymentData,
            paymentId: paymentData.paymentId || uid.stamp(10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    };
    await dynamodb.put(params).promise();
    return params.Item;
};

exports.getPaymentByUserId = async (userId) => {
    const params = {
        TableName: DYNAMODB_PAYMENT_TABLE,
        IndexName: 'UserOrdersIndex',
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: {
            ':uid': userId
        }
    };
    const result = await dynamodb.query(params).promise();
    return result.Items;
};

// exports.getOrdersByOrderId = async (orderId) => {
//     const params = {
//         TableName: DYNAMODB_ORDER_TABLE,
//         IndexName: 'OrderStatusIndex',
//         KeyConditionExpression: 'orderId = :id',
//         ExpressionAttributeValues: {
//             ':id': orderId
//         }
//     };
//     const result = await dynamodb.query(params).promise();
//     return result.Items;
// };

// exports.getOrdersByStatus = async (status) => {
//     const params = {
//         TableName: DYNAMODB_ORDER_TABLE,
//         IndexName: 'OrderStatusIndex',
//         KeyConditionExpression: 'orderStatus = :status',
//         ExpressionAttributeValues: {
//             ':status': status
//         }
//     };
//     const result = await dynamodb.query(params).promise();
//     return result.Items;
// };
