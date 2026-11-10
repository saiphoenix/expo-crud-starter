/**
 * LOCAL MOCK API — a tiny fake backend for practice.
 *
 * Every Create / Update / Delete you do in the app is written to
 * mock-api/db.json, so you can open that file and watch it change.
 *
 * Zero dependencies — plain Node.js `http` + `fs`. Read it top to bottom:
 * it is a good first look at what a REST backend actually does.
 *
 *   pnpm mock:api          start the server   (http://localhost:3001)
 *   pnpm mock:reset        restore db.json from db.seed.json
 *
 * Any top-level array in db.json becomes a CRUD resource (products, posts, ...).
 *
 * Responses use the SAME shape as https://dummyjson.com, so the app's
 * service layer does not change — only EXPO_PUBLIC_API_URL in .env does.
 * See docs/16-mock-api.md
 */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PORT = Number(process.env.MOCK_PORT ?? 3001);
const DELAY_MS = Number(process.env.MOCK_DELAY ?? 400); // fake network latency so you can see loaders
const DB_FILE = path.join(__dirname, 'db.json');
const SEED_FILE = path.join(__dirname, 'db.seed.json');
const DEFAULT_THUMBNAIL = 'https://dummyjson.com/image/400x400/e2e8f0/334155?text=New+Product';
const EDITABLE_FIELDS = ['title', 'description', 'category', 'price', 'stock', 'thumbnail'];

// ---------- "database" helpers (a JSON file) ----------

function readDb() {
  if (!fs.existsSync(DB_FILE))
    fs.copyFileSync(SEED_FILE, DB_FILE);
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, `${JSON.stringify(db, null, 2)}\n`);
}

function pick(obj, keys) {
  return Object.fromEntries(keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]));
}

// ---------- validation (the server must never trust the client) ----------

function validate(input, { partial }) {
  const errors = {};
  const has = k => input[k] !== undefined;
  if ((!partial || has('title')) && (typeof input.title !== 'string' || input.title.trim().length < 3))
    errors.title = 'Title must be at least 3 characters';
  if ((!partial || has('price')) && !(typeof input.price === 'number' && input.price > 0))
    errors.price = 'Price must be a number greater than 0';
  if ((!partial || has('stock')) && !(Number.isInteger(input.stock) && input.stock >= 0))
    errors.stock = 'Stock must be a whole number (0 or more)';
  return Object.keys(errors).length ? errors : null;
}

// ---------- HTTP helpers ----------

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // lets Expo web call it too
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      }
      catch {
        reject(new Error('Body is not valid JSON'));
      }
    });
  });
}

// ---------- routes ----------
//
// Works for EVERY top-level array in db.json ("products", "posts", ...).
// Add a new array to db.json, restart, and you get a full CRUD API for it:
//   GET /<name>  GET /<name>/search?q=  GET /<name>/:id
//   POST /<name>/add (or POST /<name>)  PUT|PATCH /<name>/:id  DELETE /<name>/:id

// Per-collection rules. Collections not listed accept any JSON fields.
const RULES = {
  products: { fields: EDITABLE_FIELDS, validate, defaults: { thumbnail: DEFAULT_THUMBNAIL } },
};

function cleanInput(collection, body) {
  const rule = RULES[collection];
  if (rule)
    return pick(body, rule.fields);
  const { id, ...rest } = body; // never let the client choose/overwrite the id
  return rest;
}

function checkInput(collection, input, partial) {
  const rule = RULES[collection];
  return rule ? rule.validate(input, { partial }) : null;
}

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split('/').filter(Boolean); // "/products/5" -> ["products", "5"]
  const method = req.method;

  if (method === 'OPTIONS')
    return send(res, 204);

  const db = readDb();

  if (parts.length === 0) {
    return send(res, 200, {
      message: 'Mock API is running. Data lives in mock-api/db.json',
      collections: Object.keys(db),
      routes: [
        'GET    /:collection?skip=0&limit=20',
        'GET    /:collection/search?q=phone',
        'GET    /:collection/:id',
        'POST   /:collection/add',
        'PUT    /:collection/:id',
        'PATCH  /:collection/:id',
        'DELETE /:collection/:id',
      ],
    });
  }

  const collection = parts[0];
  const items = db[collection];
  if (!Array.isArray(items))
    return send(res, 404, { message: `Route ${url.pathname} not found` });

  // READ — list + search (newest first, so items you create show at the top)
  if (method === 'GET' && (parts.length === 1 || parts[1] === 'search')) {
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const skip = Number(url.searchParams.get('skip') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 30);
    const matches = items
      .filter(item => !q || JSON.stringify(item).toLowerCase().includes(q))
      .sort((a, b) => b.id - a.id);
    return send(res, 200, {
      [collection]: limit === 0 ? matches.slice(skip) : matches.slice(skip, skip + limit),
      total: matches.length,
      skip,
      limit,
    });
  }

  // CREATE — POST /products/add (DummyJSON style) or POST /products (REST style)
  if (method === 'POST' && (parts.length === 1 || (parts.length === 2 && parts[1] === 'add'))) {
    const input = cleanInput(collection, await readBody(req));
    const errors = checkInput(collection, input, false);
    if (errors)
      return send(res, 400, { message: Object.values(errors)[0], errors });
    const id = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const created = { id, ...RULES[collection]?.defaults, ...input };
    items.push(created);
    writeDb(db);
    return send(res, 201, created);
  }

  // Everything below works on one item: /:collection/:id
  const id = Number(parts[1]);
  const index = items.findIndex(item => item.id === id);
  if (parts.length !== 2 || index === -1)
    return send(res, 404, { message: `${collection}/${parts[1] ?? ''} not found` });

  // READ — one
  if (method === 'GET')
    return send(res, 200, items[index]);

  // UPDATE — PUT and PATCH both merge the fields you send
  if (method === 'PUT' || method === 'PATCH') {
    const input = cleanInput(collection, await readBody(req));
    const errors = checkInput(collection, input, true);
    if (errors)
      return send(res, 400, { message: Object.values(errors)[0], errors });
    items[index] = { ...items[index], ...input, id };
    writeDb(db);
    return send(res, 200, items[index]);
  }

  // DELETE
  if (method === 'DELETE') {
    const [removed] = items.splice(index, 1);
    writeDb(db);
    return send(res, 200, { ...removed, isDeleted: true, deletedOn: new Date().toISOString() });
  }

  return send(res, 405, { message: `${method} not allowed on ${url.pathname}` });
}

// ---------- start ----------

if (process.argv.includes('--reset')) {
  fs.copyFileSync(SEED_FILE, DB_FILE);
  console.log('✅ mock-api/db.json reset from db.seed.json');
  process.exit(0);
}

http
  .createServer((req, res) => {
    const started = Date.now();
    res.on('finish', () => {
      console.log(`${req.method.padEnd(6)} ${req.url}  →  ${res.statusCode}  (${Date.now() - started}ms)`);
    });
    setTimeout(() => {
      handle(req, res).catch(err => send(res, 400, { message: err.message }));
    }, DELAY_MS);
  })
  .listen(PORT, '0.0.0.0', () => {
    readDb();
    console.log(`🚀 Mock API on http://localhost:${PORT}  (data: mock-api/db.json, delay: ${DELAY_MS}ms)`);
  });
