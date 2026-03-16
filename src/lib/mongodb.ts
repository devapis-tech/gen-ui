import { MongoClient, Db, Collection, Document, WithId, Filter, UpdateFilter, OptionalUnlessRequiredId } from 'mongodb';

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
export async function getCollection<T extends Document = any>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Common CRUD operations
export async function findOne<T extends Document = any>(collectionName: string, query: Filter<T>): Promise<WithId<T> | null> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.findOne(query);
  return result || null;
}

export async function findMany<T extends Document = any>(collectionName: string, query: Filter<T> = {}, options: object = {}): Promise<WithId<T>[]> {
  const collection = await getCollection<T>(collectionName);
  return await collection.find(query, options).toArray();
}

export async function insertOne<T extends Document = any>(collectionName: string, document: OptionalUnlessRequiredId<T>): Promise<WithId<T>> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.insertOne(document);
  return { ...document, _id: result.insertedId } as WithId<T>;
}

export async function updateOne<T extends Document = any>(collectionName: string, query: Filter<T>, update: Partial<T>): Promise<WithId<T> | null> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' });
  return result?.value || null;
}

export async function deleteOne<T extends Document = any>(collectionName: string, query: Filter<T>): Promise<boolean> {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteOne(query);
  return result.deletedCount === 1;
}

export async function countDocuments<T extends Document = any>(collectionName: string, query: Filter<T> = {}): Promise<number> {
  const collection = await getCollection<T>(collectionName);
  return await collection.countDocuments(query);
}
