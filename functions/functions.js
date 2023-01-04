const { MongoClient } = require("mongodb");
const { config } = require("dotenv").config();

async function connectDB() {
  const client = new MongoClient(
    process.env.MONGODB_URI,
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
  );
  await client.connect();
  return client;
}

module.exports = { connectDB };
