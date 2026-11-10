# 4. API Layer (Layers 1 & 2)

← [Architecture](./03-architecture.md) · Next: [React Query](./05-react-query.md) →

## 4.1 Layer 1 — The HTTP client

File: [`src/lib/api/client.tsx`](../src/lib/api/client.tsx)

There is **exactly one** axios instance. Every request in the app goes through it. Never call `axios.get` or `fetch` anywhere else.

```ts
export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL, // from .env / env.ts
  timeout: 15000,
});
```

### Interceptors = checkpoints every request passes through

```
 App ──▶ [REQUEST interceptor: add token] ──▶ Server
 App ◀── [RESPONSE interceptor: handle errors] ◀── Server
```

**Request interceptor** — reads the token from MMKV and adds the header:

```ts
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token?.access) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});
```

**Response interceptor** — handles errors once, for the whole app:

| Situation | What we do |
|---|---|
| `401 Unauthorized` | `signOut()` → the auth guard sends the user to `/login` |
| Server sent `{ message: "..." }` | Use that as `error.message` |
| Timeout | "The request took too long…" |
| No response at all | "No internet connection…" |

Because of this, screens can simply show `error.message` — it's always human-readable. The error is still an `AxiosError`, so you can read `error.response?.status` when you need to.

> 🔜 **Refresh tokens:** a real backend usually gives a short-lived access token + a refresh token. The next step is: on 401, call the refresh endpoint, save the new token, and **retry the original request** instead of signing out. That logic also belongs in this file.

## 4.2 Layer 2 — Services

File: [`src/features/products/service.ts`](../src/features/products/service.ts)

A service is a plain object of async functions — **one function per endpoint**. No React, no hooks.

```ts
export const productService = {
  getAll:  async ({ q, skip = 0, limit = 20 }) => { /* GET  /products or /products/search */ },
  getById: async (id)        => { /* GET    /products/:id  */ },
  create:  async (input)     => { /* POST   /products/add  */ },
  update:  async (id, input) => { /* PUT    /products/:id  */ },
  remove:  async (id)        => { /* DELETE /products/:id  */ },
};
```

Each function:
1. calls `client.<method><ResponseType>(url, …)` — the generic gives you typed `data`
2. returns **only** `data` (not the whole axios response)

```ts
getById: async (id: number) => {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
},
```

### Types first

Write `types.ts` **before** the service. Open the endpoint in a browser/Postman, look at the JSON, and describe only the fields you use:

```ts
export type Product = { id: number; title: string; price: number; /* … */ };
export type ProductListResponse = { products: Product[]; total: number; skip: number; limit: number };
export type ProductInput = Pick<Product, 'title' | 'description' | 'category' | 'price' | 'stock'>;
```

### CRUD ↔ HTTP cheat sheet

| Operation | Method | Products endpoint |
|---|---|---|
| Create | `POST` | `/products/add` |
| Read (list) | `GET` | `/products?skip=0&limit=20` |
| Read (search) | `GET` | `/products/search?q=phone` |
| Read (one) | `GET` | `/products/5` |
| Update | `PUT` / `PATCH` | `/products/5` |
| Delete | `DELETE` | `/products/5` |

## 4.3 The practice APIs

| | Local mock API (**default**) | DummyJSON (remote) |
|---|---|---|
| `.env` | `EXPO_PUBLIC_API_URL=http://localhost:3001/` | `EXPO_PUBLIC_API_URL=https://dummyjson.com/` |
| Start | `pnpm mock:api` | nothing, it's online |
| Create / Update / Delete | ✅ **really saved** to `mock-api/db.json` | ⚠️ simulated, nothing is saved |

Both return the **same JSON shape**, so `service.ts` works with either. Only the base URL changes. See [16 · Mock API](./16-mock-api.md).

> On DummyJSON, a product you create won't appear in the list (and its detail page 404s), and edits revert after a refetch. That's expected, not a bug in your code.

## 4.4 Environment variables

- Defined + validated in [`env.ts`](../env.ts) (Zod schema), values in `.env`.
- Import with `import Env from 'env';` — never read `process.env` inside `src/`.
- Variables the **app** reads must start with `EXPO_PUBLIC_`.

> 🔒 **Everything prefixed `EXPO_PUBLIC_` is shipped inside the app and can be read by anyone.** Never put secret keys there — secrets belong on the backend.

To add a new variable: add it to the schema **and** the `_env` object in `env.ts`, add it to `.env`, restart with `pnpm start -c`.

## 4.5 Checklist for a new endpoint

- [ ] Type for the response (and request body) in `types.ts`
- [ ] One function in `service.ts` using `client`
- [ ] A hook in `api.ts` (next doc)
- [ ] A unit test for the service URL/params (see `service.test.ts`)
