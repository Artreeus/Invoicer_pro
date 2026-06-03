import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';

let client = null;
let db = null;
let dbPromise = null;

// Connect lazily and cache the connection at module scope. In a serverless
// environment this is reused across warm invocations, so the handshake and
// index setup only happen on a cold start — not on every request.
export function connect() {
  if (db) return Promise.resolve(db);
  if (!dbPromise) {
    dbPromise = (async () => {
      const uri = process.env.DATABASE_URL;
      if (!uri) throw new Error('DATABASE_URL is not set');
      client = new MongoClient(uri);
      await client.connect();
      // Database name is taken from the connection string (…/invoice_pro?…).
      db = client.db();
      await ensureIndexes(db);
      console.log(`Connected to MongoDB database "${db.databaseName}"`);
      return db;
    })();
  }
  return dbPromise;
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('companies').createIndex({ owner_id: 1 }),
    db.collection('clients').createIndex({ owner_id: 1, company_id: 1 }),
    db.collection('invoices').createIndex({ owner_id: 1, company_id: 1 }),
    db.collection('invoices').createIndex({ client_id: 1 }),
    db.collection('invoices').createIndex({ status: 1 }),
    db.collection('invoices').createIndex(
      { company_id: 1, invoice_number: 1 },
      { unique: true }
    ),
    db.collection('invoice_items').createIndex({ invoice_id: 1 }),
    db.collection('item_library').createIndex({ owner_id: 1, company_id: 1 }),
  ]);
}

export function coll(name) {
  return db.collection(name);
}

// Generate a string id (mirrors the UUID primary keys used by the old schema).
export function newId() {
  return randomUUID();
}

// MongoDB stores the primary key as `_id`; the frontend expects `id`.
export function serialize(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

export function serializeMany(docs) {
  return docs.map(serialize);
}
