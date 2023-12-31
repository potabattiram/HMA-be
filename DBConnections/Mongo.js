const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://rampotabatti:DtlvNLLKOAQhEIEP@hma.rpyvgw6.mongodb.net/test';
let client;

async function connectToDatabase() {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to DB!')
    }
    catch(e){
        console.log(e)
    }
    finally {
        // await client.close();
    }
}
connectToDatabase().catch(console.error);

module.exports = { client, connectToDatabase };