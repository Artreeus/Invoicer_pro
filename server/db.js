import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL is not set. Add it to your .env file.');
  process.exit(1);
}

const client = new MongoClient(uri);
let db;

export async function connect() {
  if (db) return db;
  await client.connect();
  // Database name is taken from the connection string (…/invoice_pro?…).
  db = client.db();
  await ensureIndexes(db);
  console.log(`Connected to MongoDB database "${db.databaseName}"`);
  return db;
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('clients').createIndex({ company_id: 1 }),
    db.collection('invoices').createIndex({ company_id: 1 }),
    db.collection('invoices').createIndex({ client_id: 1 }),
    db.collection('invoices').createIndex({ status: 1 }),
    db.collection('invoices').createIndex(
      { company_id: 1, invoice_number: 1 },
      { unique: true }
    ),
    db.collection('invoice_items').createIndex({ invoice_id: 1 }),
    db.collection('item_library').createIndex({ company_id: 1 }),
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
