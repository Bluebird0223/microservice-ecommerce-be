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
        { AttributeName: 'productId', AttributeType: 'S' },
        { AttributeName: 'categoryId', AttributeType: 'S' },
        { AttributeName: 'stockQuantity', AttributeType: 'N' },
        // It's good practice to also include attributes that might be part of other future indexes,
        // or attributes you frequently query/sort by even if not a key yet, e.g., 'price' if you plan to filter by range.
        // { AttributeName: 'price', AttributeType: 'N' }, // If you plan a GSI on price later
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
                { AttributeName: 'categoryId', KeyType: 'HASH' }, // Changed from 'category'
            ],
            Projection: {
                ProjectionType: 'ALL', // Includes all attributes in the index
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
        {
            IndexName: 'StockIndex', // GSI for finding active products with stock
            KeySchema: [
                { AttributeName: 'stockQuantity', KeyType: 'HASH' }, // Changed from 'stock' in your Joi, now matches. Type 'N'
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

const cartTableSchema = {
    TableName: 'Carts',
    AttributeDefinitions: [
        { AttributeName: 'cartId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
    ],
    KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'cartId', KeyType: 'RANGE' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
};

const orderTableSchema = {
    TableName: 'Orders',
    AttributeDefinitions: [
        { AttributeName: 'orderId', AttributeType: 'S' }, // Partition Key
        { AttributeName: 'userId', AttributeType: 'S' },  // For UserOrdersIndex GSI
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
    cartTableSchema,
    orderTableSchema,
    paymentTableSchema,
};