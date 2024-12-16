import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI
const options = {} // You can specify connection options here if needed

// Ensure the URI exists
if (!URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

let client = new MongoClient(URI, options)
let clientPromise: Promise<MongoClient>

// Type declaration for global object to store the MongoDB client promise in development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Check if the environment is not production
if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
