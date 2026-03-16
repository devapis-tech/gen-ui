import { MongoClient, Db, Collection, Document, WithId, Filter, UpdateFilter } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('clinical_trial_db');
}

// Generic collection operations
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Common CRUD operations
export async function findOne<T = any>(collectionName: string, query: object): Promise<T | null> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.findOne(query);
  return result || null;
}

export async function findMany<T = any>(collectionName: string, query: object = {}, options: object = {}): Promise<T[]> {
  const collection = await getCollection<T>(collectionName);
  return await collection.find(query, options).toArray();
}

export async function insertOne<T = any>(collectionName: string, document: T): Promise<T> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertOne(document as any);
  return { ...document, _id: result.insertedId } as T;
}

export async function updateOne<T = any>(collectionName: string, query: object, update: object): Promise<T | null> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' });
  return result.value || null;
}

export async function deleteOne<T = any>(collectionName: string, query: object): Promise<boolean> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteOne(query);
  return result.deletedCount === 1;
}

export async function countDocuments<T = any>(collectionName: string, query: object = {}): Promise<number> {
  const collection = await getCollection<T>(collectionName);
  return await collection.countDocuments(query);
}
