// lib/mongodb.js
import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Replace the URI with your MongoDB connection string
  const uri = process.env.MONGODB_URI; // Store in environment variable
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!cachedClient) {
    cachedClient = await client.connect();
  }

  const db = cachedClient.db("Portfolio-Data"); // Replace with your database name
  cachedDb = db;

  return { client: cachedClient, db: cachedDb };
}
