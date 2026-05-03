import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

let client = globalThis.mongoClient;
let clientPromise = globalThis.mongoClientPromise;

export async function connectDB() {
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  if (!client) {
    client = new MongoClient(uri);
    globalThis.mongoClient = client;
  }

  if (!clientPromise) {
    clientPromise = client.connect();
    globalThis.mongoClientPromise = clientPromise;
  }

  await clientPromise;
  return client;
}