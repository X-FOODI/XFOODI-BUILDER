/* ──────────────────────────────────────────────
 *  MongoDB connection singleton for Next.js
 * ────────────────────────────────────────────── */

import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "xfoodi_builder";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// In dev, hot-reload would create multiple connections without caching
const globalWithMongo = globalThis as typeof globalThis & { _mongoCache?: MongoCache };

if (!globalWithMongo._mongoCache) {
  globalWithMongo._mongoCache = { client: null, db: null, promise: null };
}
const cache = globalWithMongo._mongoCache;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cache.client && cache.db) {
    return { client: cache.client, db: cache.db };
  }

  if (!cache.promise) {
    cache.promise = MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
    }).then((client) => {
      const db = client.db(MONGODB_DB);
      cache.client = client;
      cache.db = db;
      return { client, db };
    });
  }

  return cache.promise;
}
