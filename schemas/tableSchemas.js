const userTableSchema = {
    TableName: 'Users',
    AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' }, // Partition Key
        { AttributeName: 'email', AttributeType: 'S' },  // For EmailIndex GSI
    ],
    KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' }, // Partition Key
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'EmailIndex',
            KeySchema: [
                { AttributeName: 'email', KeyType: 'HASH' },
            ],
            Projection: {
                ProjectionType: 'ALL', // Or 'KEYS_ONLY', 'INCLUDE'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
    ],
};
const categoryTableSchema = {
    TableName: 'Categories',
    AttributeDefinitions: [
        { AttributeName: 'categoryId', AttributeType: 'S' }, // Partition Key
    ],
    KeySchema: [
        { AttributeName: 'categoryId', KeyType: 'HASH' }, // Partition Key
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};


const productTableSchema = {
    TableName: 'Products',
    AttributeDefinitions: [
        { AttributeName: 'productId', AttributeType: 'S' }, // Partition Key
        { AttributeName: 'category', AttributeType: 'S' }, // For CategoryIndex GSI
        { AttributeName: 'isActive', AttributeType: 'BOOL' }, // For StockIndex GSI
        { AttributeName: 'stockQuantity', AttributeType: 'N' }, // For StockIndex GSI
    ],
    KeySchema: [
        { AttributeName: 'productId', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'CategoryIndex',
            KeySchema: [
                { AttributeName: 'category', KeyType: 'HASH' },
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
        {
            IndexName: 'StockIndex', // Example GSI for finding active products with stock
            KeySchema: [
                { AttributeName: 'isActive', KeyType: 'HASH' },
                { AttributeName: 'stockQuantity', KeyType: 'RANGE' }, // Sort by stock
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
    ],
};

const orderTableSchema = {
    TableName: 'Orders',
    AttributeDefinitions: [
        { AttributeName: 'orderId', AttributeType: 'S' }, // Partition Key
        { AttributeName: 'userId', AttributeType: 'S' },  // For UserOrdersIndex GSI
        { AttributeName: 'createdAt', AttributeType: 'S' }, // For UserOrdersIndex Sort Key and OrderStatusIndex Sort Key
        { AttributeName: 'orderStatus', AttributeType: 'S' }, // For OrderStatusIndex GSI
    ],
    KeySchema: [
        { AttributeName: 'orderId', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'UserOrdersIndex',
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort orders by creation date for a user
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
        {
            IndexName: 'OrderStatusIndex',
            KeySchema: [
                { AttributeName: 'orderStatus', KeyType: 'HASH' },
                { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort by creation date within a status
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
    ],
};

const paymentTableSchema = {
    TableName: 'Payments',
    AttributeDefinitions: [
        { AttributeName: 'paymentId', AttributeType: 'S' }, // Partition Key
        { AttributeName: 'orderId', AttributeType: 'S' }, // For OrderPaymentIndex GSI
    ],
    KeySchema: [
        { AttributeName: 'paymentId', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'OrderPaymentIndex',
            KeySchema: [
                { AttributeName: 'orderId', KeyType: 'HASH' },
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
    ],
};


module.exports = {
    userTableSchema,
    categoryTableSchema,
    productTableSchema,
    orderTableSchema,
    paymentTableSchema,
};