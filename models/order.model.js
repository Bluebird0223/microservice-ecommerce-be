
const { dynamodb, DYNAMODB_ORDER_TABLE } = require('../config/aws');
const uniqId = require("short-unique-id");
const { getUserById } = require('./user.model');
const uid = new uniqId();

exports.createOrder = async (orderData) => {
    const params = {
        TableName: DYNAMODB_ORDER_TABLE,
        Item: {
            ...orderData,
            orderId: orderData.orderId || uid.stamp(10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    };
    await dynamodb.put(params).promise();
    return params.Item;
};

exports.getOrdersByUserId = async (userId) => {
    const params = {
        TableName: DYNAMODB_ORDER_TABLE,
        IndexName: 'UserOrdersIndex',
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: {
            ':uid': userId
        }
    };
    const result = await dynamodb.query(params).promise();
    const orders = result.Items;

    const user = await getUserById(userId); // fetch user name from Users table

    // Add user name to each order
    const ordersWithUser = orders.map(order => ({
        ...order,
        userName: user?.username || 'Unknown User'
    }));

    return ordersWithUser;
};

exports.getOrdersByOrderId = async (orderId) => {
    const params = {
        TableName: DYNAMODB_ORDER_TABLE,
        Key: {
            orderId: orderId
        }
    };
    const result = await dynamodb.get(params).promise();
    return result.Item;
};

exports.getOrdersByStatus = async (status) => {
    const params = {
        TableName: DYNAMODB_ORDER_TABLE,
        IndexName: 'OrderStatusIndex',
        KeyConditionExpression: 'orderStatus = :status',
        ExpressionAttributeValues: {
            ':status': status
        }
    };
    const result = await dynamodb.query(params).promise();
    return result.Items;
};
