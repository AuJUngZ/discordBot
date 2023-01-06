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

async function updateDB() {
  const fields = {
    last_used_work: 0,
  };
  //add this field to all of the users
  const client = await connectDB();
  const db = client.db("user");
  const collection = db.collection("userinfo").updateMany({}, { $set: fields });
}

module.exports = { connectDB, updateDB };
