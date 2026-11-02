# 13. Recipe: Adding a New Feature

← [Environments & Builds](./12-environments-and-builds.md) · Next: [Debugging & Common Mistakes](./14-debugging-and-common-mistakes.md) →

Follow these steps **in order** for any CRUD feature. Example: **Orders**. At every step, open the matching Products file and copy its shape.

## Step 0 — Branch

```bash
git checkout main && git pull && git checkout -b feat/orders
```

## Step 1 — Folder

```
src/features/orders/
├── types.ts
├── service.ts
├── query-keys.ts
├── api.ts
├── schema.ts              (only if there's a form)
├── orders-screen.tsx
├── order-detail-screen.tsx
└── components/
```

## Step 2 — `types.ts` (copy `products/types.ts`)

Look at the real API response first (browser / Postman). Type only what you use.

```ts
export type Order = { id: number; total: number; status: 'pending' | 'paid' | 'shipped'; createdAt: string };
export type OrderListResponse = { orders: Order[]; total: number; skip: number; limit: number };
```

## Step 3 — `service.ts` (copy `products/service.ts`)

```ts
export const orderService = {
  getAll: async (params: { skip?: number; limit?: number }) =>
    (await client.get<OrderListResponse>('/orders', { params })).data,
  getById: async (id: number) => (await client.get<Order>(`/orders/${id}`)).data,
};
```

## Step 4 — `query-keys.ts` (copy `products/query-keys.ts`)

```ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: object) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};
```

## Step 5 — `api.ts` (copy `products/api.ts`)

`useOrders`, `useOrder(id)`, and mutations. Every mutation invalidates the right keys in `onSuccess`.

## Step 6 — Screens

Each data screen handles: ⏳ loading · ❌ error + retry · 📭 empty · ✅ success. Use `components/ui` and `translate()`.

## Step 7 — Routes (one-liners)

```tsx
// src/app/(app)/orders.tsx            ← a tab
export { OrdersScreen as default } from '@/features/orders/orders-screen';

// src/app/order/[id]/index.tsx        ← pushed on top of tabs
export { OrderDetailScreen as default } from '@/features/orders/order-detail-screen';
```

If it's a tab, register it in `src/app/(app)/_layout.tsx`.

## Step 8 — Translations

Add an `"orders": { … }` block to **both** `en.json` and `ar.json`, then `pnpm lint:translations`.

## Step 9 — Tests

Schema/converter tests, service URL tests, one component test. Optional Maestro flow in `.maestro/orders/`.

## Step 10 — Check and ship

```bash
pnpm check-all
git add src/features/orders src/app src/translations
git commit -m "feat(orders): add orders list and detail"
git push -u origin feat/orders
```

Open a PR using the checklist in [Code Quality & Git](./11-code-quality-and-git.md#115-pull-request-checklist).

---

## One-page checklist

- [ ] `types.ts`
- [ ] `service.ts` — one function per endpoint, uses `client`
- [ ] `query-keys.ts` — key factory
- [ ] `api.ts` — queries + mutations with invalidation
- [ ] `schema.ts` — Zod + converters (if a form exists)
- [ ] Screens — 4 states, `components/ui`, `translate()`
- [ ] Route files — one line each; tab registered if needed
- [ ] `en.json` + `ar.json`
- [ ] Tests
- [ ] Android + iOS checked
- [ ] `pnpm check-all` ✅ → PR
