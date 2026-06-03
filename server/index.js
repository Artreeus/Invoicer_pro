import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connect, coll, newId, serialize, serializeMany } from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const now = () => new Date().toISOString();

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

// Wrap async handlers so thrown errors become 500s instead of crashing.
const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ---- Companies ----------------------------------------------------------------

app.get('/api/companies', wrap(async (_req, res) => {
  const docs = await coll('companies').find().sort({ created_at: 1 }).toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/companies', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...companyDefaults(),
    ...req.body,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('companies').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/companies/:id', wrap(async (req, res) => {
  const { id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('companies').updateOne({ _id: req.params.id }, { $set: updates });
  const doc = await coll('companies').findOne({ _id: req.params.id });
  res.json(serialize(doc));
}));

app.delete('/api/companies/:id', wrap(async (req, res) => {
  const companyId = req.params.id;
  const invoices = await coll('invoices').find({ company_id: companyId }).toArray();
  const invoiceIds = invoices.map((i) => i._id);
  // Cascade delete everything owned by the company (ON DELETE CASCADE).
  await Promise.all([
    coll('invoice_items').deleteMany({ invoice_id: { $in: invoiceIds } }),
    coll('invoices').deleteMany({ company_id: companyId }),
    coll('clients').deleteMany({ company_id: companyId }),
    coll('item_library').deleteMany({ company_id: companyId }),
  ]);
  await coll('companies').deleteOne({ _id: companyId });
  res.status(204).end();
}));

// ---- Clients ------------------------------------------------------------------

app.get('/api/clients', wrap(async (req, res) => {
  const filter = req.query.company_id ? { company_id: req.query.company_id } : {};
  const docs = await coll('clients').find(filter).sort({ name: 1 }).toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/clients', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...clientDefaults(),
    ...req.body,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('clients').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/clients/:id', wrap(async (req, res) => {
  const { id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('clients').updateOne({ _id: req.params.id }, { $set: updates });
  const doc = await coll('clients').findOne({ _id: req.params.id });
  res.json(serialize(doc));
}));

app.delete('/api/clients/:id', wrap(async (req, res) => {
  // ON DELETE SET NULL: keep invoices but clear the reference.
  await coll('invoices').updateMany(
    { client_id: req.params.id },
    { $set: { client_id: null } }
  );
  await coll('clients').deleteOne({ _id: req.params.id });
  res.status(204).end();
}));

// ---- Item library -------------------------------------------------------------

app.get('/api/item-library', wrap(async (req, res) => {
  const filter = req.query.company_id ? { company_id: req.query.company_id } : {};
  const docs = await coll('item_library').find(filter).sort({ name: 1 }).toArray();
  res.json(serializeMany(docs));
}));

app.post('/api/item-library', wrap(async (req, res) => {
  const doc = {
    _id: newId(),
    ...libraryDefaults(),
    ...req.body,
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('item_library').insertOne(doc);
  res.status(201).json(serialize(doc));
}));

app.patch('/api/item-library/:id', wrap(async (req, res) => {
  const { id, ...updates } = req.body;
  updates.updated_at = now();
  await coll('item_library').updateOne({ _id: req.params.id }, { $set: updates });
  const doc = await coll('item_library').findOne({ _id: req.params.id });
  res.json(serialize(doc));
}));

app.delete('/api/item-library/:id', wrap(async (req, res) => {
  await coll('item_library').deleteOne({ _id: req.params.id });
  res.status(204).end();
}));

// ---- Invoices -----------------------------------------------------------------

// List with each invoice's client joined in (replaces `select('*, client:clients(*)')`).
app.get('/api/invoices', wrap(async (req, res) => {
  const filter = req.query.company_id ? { company_id: req.query.company_id } : {};
  const invoices = await coll('invoices').find(filter).sort({ created_at: -1 }).toArray();
  const clientIds = [...new Set(invoices.map((i) => i.client_id).filter(Boolean))];
  const clients = clientIds.length
    ? await coll('clients').find({ _id: { $in: clientIds } }).toArray()
    : [];
  const clientById = new Map(clients.map((c) => [c._id, serialize(c)]));
  res.json(invoices.map((inv) => ({
    ...serialize(inv),
    client: inv.client_id ? clientById.get(inv.client_id) ?? null : null,
  })));
}));

// Single invoice with client, company and items joined in.
app.get('/api/invoices/:id', wrap(async (req, res) => {
  const invoice = await coll('invoices').findOne({ _id: req.params.id });
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
    created_at: now(),
    updated_at: now(),
  };
  delete doc.id;
  await coll('invoices').insertOne(doc);
  await insertItems(invoiceId, items);
  res.status(201).json(serialize(doc));
}));

// Update an invoice and replace its line items.
app.put('/api/invoices/:id', wrap(async (req, res) => {
  const { updates = {}, items = [] } = req.body;
  const { id, ...rest } = updates;
  rest.updated_at = now();
  await coll('invoices').updateOne({ _id: req.params.id }, { $set: rest });
  await coll('invoice_items').deleteMany({ invoice_id: req.params.id });
  await insertItems(req.params.id, items);
  const doc = await coll('invoices').findOne({ _id: req.params.id });
  res.json(serialize(doc));
}));

app.patch('/api/invoices/:id/status', wrap(async (req, res) => {
  await coll('invoices').updateOne(
    { _id: req.params.id },
    { $set: { status: req.body.status, updated_at: now() } }
  );
  res.status(204).end();
}));

app.delete('/api/invoices/:id', wrap(async (req, res) => {
  await coll('invoice_items').deleteMany({ invoice_id: req.params.id });
  await coll('invoices').deleteOne({ _id: req.params.id });
  res.status(204).end();
}));

async function insertItems(invoiceId, items) {
  if (!items.length) return;
  const docs = items.map((item, i) => {
    const { id, ...rest } = item;
    return {
      _id: newId(),
      ...itemDefaults(),
      ...rest,
      invoice_id: invoiceId,
      sort_order: i,
    };
  });
  await coll('invoice_items').insertMany(docs);
}

// ---- Start --------------------------------------------------------------------

const PORT = process.env.PORT || 4000;
connect()
  .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
