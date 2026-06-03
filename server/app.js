import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connect, coll, newId, serialize, serializeMany } from './db.js';
import { hashPassword, verifyPassword, signToken, authRequired } from './auth.js';
import { signUpload, cloudinaryConfigured } from './cloudinary.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure the database is connected before handling any request. connect() caches
// the connection, so this is effectively free after the first call — which is
// what makes the same app safe to run both as a long-lived server and as a
// serverless function.
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const now = () => new Date().toISOString();

// Wrap async handlers so thrown errors become 500s instead of crashing.
const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ---- Default values mirroring the previous Postgres schema --------------------

const companyDefaults = () => ({
  logo_url: '', address: '', phone: '', email: '', website: '',
  bin: '', tin: '', vat_registration_number: '', trade_license_number: '',
  bank_details: {}, mobile_banking: {}, brand_color: '#0d9488',
  invoice_prefix: 'INV', next_invoice_number: 1, default_vat_rate: 15,
  default_terms: '', default_payment_instructions: '',
});

const clientDefaults = () => ({
  address: '', phone: '', email: '', contact_person: '',
  bin: '', tin: '', notes: '',
});

const invoiceDefaults = () => ({
  client_id: null, status: 'draft', due_date: null, currency: 'BDT',
  subtotal: 0, total_discount: 0, total_vat: 0, grand_total: 0,
  template_id: 'corporate', notes: '', terms_and_conditions: '',
  payment_instructions: '',
  footer_thank_you_note: 'Thank you for your business!',
  vat_disclaimer: 'VAT collected as per Bangladesh VAT and Supplementary Duty Act 2012.',
  authorized_signatory_name: '', authorized_signatory_title: '',
});

const itemDefaults = () => ({
  sort_order: 0, item_name: '', description: '', quantity: 1, unit_price: 0,
  discount_type: 'percentage', discount_value: 0, vat_rate: 0,
  vat_amount: 0, line_total: 0,
});

const libraryDefaults = () => ({
  description: '', default_unit_price: 0, default_vat_rate: 15, category: '',
});

// Strip the password hash before returning a user to the client.
const serializeUser = (user) => {
  if (!user) return user;
  const { _id, password_hash, ...rest } = user;
  return { id: _id, ...rest };
};

// ---- Auth (public) ------------------------------------------------------------

app.post('/api/auth/register', wrap(async (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const existing = await coll('users').findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const user = {
    _id: newId(),
    name,
    email,
    password_hash: await hashPassword(password),
    created_at: now(),
    updated_at: now(),
  };
  await coll('users').insertOne(user);
  res.status(201).json({ token: signToken(user), user: serializeUser(user) });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const user = await coll('users').findOne({ email });
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json({ token: signToken(user), user: serializeUser(user) });
}));

// ---- Everything below requires authentication ---------------------------------

app.use('/api', authRequired);

app.get('/api/auth/me', wrap(async (req, res) => {
  const user = await coll('users').findOne({ _id: req.user.id });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(serializeUser(user));
}));

// Update the signed-in user's profile (name and/or email).
app.patch('/api/auth/me', wrap(async (req, res) => {
  const updates = {};
  if (typeof req.body.name === 'string' && req.body.name.trim()) {
    updates.name = req.body.name.trim();
  }
  if (typeof req.body.email === 'string' && req.body.email.trim()) {
    const email = req.body.email.trim().toLowerCase();
    const existing = await coll('users').findOne({ email });
    if (existing && existing._id !== req.user.id) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    updates.email = email;
  }
  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  updates.updated_at = now();
  await coll('users').updateOne({ _id: req.user.id }, { $set: updates });
  const user = await coll('users').findOne({ _id: req.user.id });
  res.json(serializeUser(user));
}));

// Change the signed-in user's password (requires the current password).
app.post('/api/auth/change-password', wrap(async (req, res) => {
  const current = req.body.current_password || '';
  const next = req.body.new_password || '';
  if (next.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  const user = await coll('users').findOne({ _id: req.user.id });
  if (!user || !(await verifyPassword(current, user.password_hash))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  await coll('users').updateOne(
    { _id: req.user.id },
    { $set: { password_hash: await hashPassword(next), updated_at: now() } }
  );
  res.status(204).end();
}));

// ---- Uploads ------------------------------------------------------------------

// Hand the browser a short-lived signature so it can upload an image straight to
// Cloudinary. Files are namespaced per user under invoice_logos/<owner_id>.
app.post('/api/uploads/signature', wrap(async (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({ error: 'Image uploads are not configured' });
  }
  res.json(signUpload(`invoice_logos/${req.user.id}`));
}));

// ---- Companies ----------------------------------------------------------------

app.get('/api/companies', wrap(async (req, res) => {
  const docs = await coll('companies')
    .find({ owner_id: req.user.id })
    .sort({ created_at: 1 })
    .toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/companies', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...companyDefaults(),
    ...req.body,
    owner_id: req.user.id,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('companies').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/companies/:id', wrap(async (req, res) => {
  const { id, owner_id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('companies').updateOne(
    { _id: req.params.id, owner_id: req.user.id },
    { $set: updates }
  );
  const doc = await coll('companies').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!doc) return res.status(404).json({ error: 'Company not found' });
  res.json(serialize(doc));
}));

app.delete('/api/companies/:id', wrap(async (req, res) => {
  const companyId = req.params.id;
  const owner = req.user.id;
  const company = await coll('companies').findOne({ _id: companyId, owner_id: owner });
  if (!company) return res.status(404).json({ error: 'Company not found' });
  const invoices = await coll('invoices').find({ company_id: companyId, owner_id: owner }).toArray();
  const invoiceIds = invoices.map((i) => i._id);
  // Cascade delete everything owned by the company (ON DELETE CASCADE).
  await Promise.all([
    coll('invoice_items').deleteMany({ invoice_id: { $in: invoiceIds } }),
    coll('invoices').deleteMany({ company_id: companyId, owner_id: owner }),
    coll('clients').deleteMany({ company_id: companyId, owner_id: owner }),
    coll('item_library').deleteMany({ company_id: companyId, owner_id: owner }),
  ]);
  await coll('companies').deleteOne({ _id: companyId, owner_id: owner });
  res.status(204).end();
}));

// ---- Clients ------------------------------------------------------------------

app.get('/api/clients', wrap(async (req, res) => {
  const filter = { owner_id: req.user.id };
  if (req.query.company_id) filter.company_id = req.query.company_id;
  const docs = await coll('clients').find(filter).sort({ name: 1 }).toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/clients', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...clientDefaults(),
    ...req.body,
    owner_id: req.user.id,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('clients').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/clients/:id', wrap(async (req, res) => {
  const { id, owner_id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('clients').updateOne(
    { _id: req.params.id, owner_id: req.user.id },
    { $set: updates }
  );
  const doc = await coll('clients').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!doc) return res.status(404).json({ error: 'Client not found' });
  res.json(serialize(doc));
}));

app.delete('/api/clients/:id', wrap(async (req, res) => {
  // ON DELETE SET NULL: keep invoices but clear the reference.
  await coll('invoices').updateMany(
    { client_id: req.params.id, owner_id: req.user.id },
    { $set: { client_id: null } }
  );
  await coll('clients').deleteOne({ _id: req.params.id, owner_id: req.user.id });
  res.status(204).end();
}));

// ---- Item library -------------------------------------------------------------

app.get('/api/item-library', wrap(async (req, res) => {
  const filter = { owner_id: req.user.id };
  if (req.query.company_id) filter.company_id = req.query.company_id;
  const docs = await coll('item_library').find(filter).sort({ name: 1 }).toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/item-library', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...libraryDefaults(),
    ...req.body,
    owner_id: req.user.id,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('item_library').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/item-library/:id', wrap(async (req, res) => {
  const { id, owner_id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('item_library').updateOne(
    { _id: req.params.id, owner_id: req.user.id },
    { $set: updates }
  );
  const doc = await coll('item_library').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!doc) return res.status(404).json({ error: 'Item not found' });
  res.json(serialize(doc));
}));

app.delete('/api/item-library/:id', wrap(async (req, res) => {
  await coll('item_library').deleteOne({ _id: req.params.id, owner_id: req.user.id });
  res.status(204).end();
}));

// ---- Invoices -----------------------------------------------------------------

// List with each invoice's client joined in (replaces `select('*, client:clients(*)')`).
app.get('/api/invoices', wrap(async (req, res) => {
  const filter = { owner_id: req.user.id };
  if (req.query.company_id) filter.company_id = req.query.company_id;
  const invoices = await coll('invoices').find(filter).sort({ created_at: -1 }).toArray();
  const clientIds = [...new Set(invoices.map((i) => i.client_id).filter(Boolean))];
  const clients = clientIds.length
    ? await coll('clients').find({ _id: { $in: clientIds }, owner_id: req.user.id }).toArray()
    : [];
  const clientById = new Map(clients.map((c) => [c._id, serialize(c)]));
  res.json(invoices.map((inv) => ({
    ...serialize(inv),
    client: inv.client_id ? clientById.get(inv.client_id) ?? null : null,
  })));
}));

// Single invoice with client, company and items joined in.
app.get('/api/invoices/:id', wrap(async (req, res) => {
  const invoice = await coll('invoices').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  const [client, company, items] = await Promise.all([
    invoice.client_id ? coll('clients').findOne({ _id: invoice.client_id }) : null,
    coll('companies').findOne({ _id: invoice.company_id }),
    coll('invoice_items').find({ invoice_id: req.params.id }).sort({ sort_order: 1 }).toArray(),
  ]);
  res.json({
    ...serialize(invoice),
    client: serialize(client),
    company: serialize(company),
    items: serializeMany(items),
  });
}));

// Create an invoice together with its line items.
app.post('/api/invoices', wrap(async (req, res) => {
  const { invoice = {}, items = [] } = req.body;
  const invoiceId = newId();
  const doc = {
    _id: invoiceId,
    ...invoiceDefaults(),
    ...invoice,
    owner_id: req.user.id,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  try {
    await coll('invoices').insertOne(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: `Invoice number "${doc.invoice_number}" already exists` });
    }
    throw err;
  }
  await insertItems(invoiceId, req.user.id, items);
  res.status(201).json(serialize(doc));
}));

// Update an invoice and replace its line items.
app.put('/api/invoices/:id', wrap(async (req, res) => {
  const owned = await coll('invoices').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!owned) return res.status(404).json({ error: 'Not found' });
  const { updates = {}, items = [] } = req.body;
  const { id, owner_id, ...rest } = updates;
  rest.updated_at = now();
  try {
    await coll('invoices').updateOne({ _id: req.params.id }, { $set: rest });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: `Invoice number "${rest.invoice_number}" already exists` });
    }
    throw err;
  }
  await coll('invoice_items').deleteMany({ invoice_id: req.params.id });
  await insertItems(req.params.id, req.user.id, items);
  const doc = await coll('invoices').findOne({ _id: req.params.id });
  res.json(serialize(doc));
}));

app.patch('/api/invoices/:id/status', wrap(async (req, res) => {
  const result = await coll('invoices').updateOne(
    { _id: req.params.id, owner_id: req.user.id },
    { $set: { status: req.body.status, updated_at: now() } }
  );
  if (!result.matchedCount) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
}));

app.delete('/api/invoices/:id', wrap(async (req, res) => {
  const owned = await coll('invoices').findOne({ _id: req.params.id, owner_id: req.user.id });
  if (!owned) return res.status(404).json({ error: 'Not found' });
  await coll('invoice_items').deleteMany({ invoice_id: req.params.id });
  await coll('invoices').deleteOne({ _id: req.params.id });
  res.status(204).end();
}));

async function insertItems(invoiceId, ownerId, items) {
  if (!items.length) return;
  const docs = items.map((item, i) => {
    const { id, ...rest } = item;
    return {
      _id: newId(),
      ...itemDefaults(),
      ...rest,
      invoice_id: invoiceId,
      owner_id: ownerId,
      sort_order: i,
    };
  });
  await coll('invoice_items').insertMany(docs);
}

export default app;
