// utils/createTable.js
const { CreateTableCommand, waitUntilTableExists } = require("@aws-sdk/client-dynamodb");
const dbClient = require('../../DB/awsDB.client'); // The low-level DynamoDB client

async function createDynamoDBTable(tableParams) {
    const { TableName, AttributeDefinitions, KeySchema, ProvisionedThroughput, GlobalSecondaryIndexes } = tableParams;

    console.log(`Attempting to create table: ${TableName}...`);

    const command = new CreateTableCommand({
        TableName,
        AttributeDefinitions,
        KeySchema,
        ProvisionedThroughput: ProvisionedThroughput || {
            ReadCapacityUnits: 5,  // Default RCU/WCU for dev/test
            WriteCapacityUnits: 5,
        },
        GlobalSecondaryIndexes,
    });

    try {
        const data = await dbClient.send(command);
        console.log(`Table ${TableName} creation initiated:`, data.TableDescription.TableStatus);

        // Wait for the table to become active
        console.log(`Waiting for table ${TableName} to become active...`);
        await waitUntilTableExists({ client: dbClient, maxWaitTime: 180 }, { TableName });
        console.log(`Table ${TableName} is ACTIVE.`);

        return data;
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.warn(`Table ${TableName} already exists. Skipping creation.`);
            // You might still want to wait for it to be active if it's newly created but not yet active
            try {
                await waitUntilTableExists({ client: dbClient, maxWaitTime: 180 }, { TableName });
                console.log(`Table ${TableName} is ACTIVE.`);
            } catch (waitError) {
                console.error(`Error waiting for existing table ${TableName} to become active:`, waitError);
                throw waitError;
            }
            return { message: `Table ${TableName} already exists.` };
        } else {
            console.error(`Error creating table ${TableName}:`, error);
            throw error;
        }
    }
}

module.exports = createDynamoDBTable;