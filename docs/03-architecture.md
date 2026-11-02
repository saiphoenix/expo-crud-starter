# 3. Architecture & Data Flow

← [Project Structure](./02-project-structure.md) · Next: [API Layer](./04-api-layer.md) →

## 3.1 The 4 layers

Every piece of server data travels through the same 4 layers. **Each layer has one job.**

| Layer | File (Products example) | Its ONE job | It must NOT |
|---|---|---|---|
| 4. Screen | `product-list-screen.tsx` | Render UI; handle loading / error / empty / success | call axios, know URLs |
| 3. Hook | `api.ts` → `useProducts` | Cache, refetch, track loading/error (React Query) | know URLs, render UI |
| 2. Service | `service.ts` → `productService` | Know endpoints + request/response shapes | use hooks, know about tokens |
| 1. Client | `src/lib/api/client.tsx` | Base URL, timeout, add token, global errors | know about products |

**Why?** If the backend renames `/products` to `/items`, you change **one line** in `service.ts`. If auth changes from Bearer tokens to cookies, you change **only** `client.tsx`. Screens never change for either.

## 3.2 Trace one request, start to finish

What happens when the Products tab opens:

```
1. ProductListScreen renders
      const { data, isPending } = useProducts(q)               ← Layer 4 → 3

2. useProducts (React Query) looks in the cache for key ['products','list',{q}]
      • found & fresh  → returns cached data, NO network call
      • missing/stale  → calls queryFn                         ← Layer 3 → 2

3. productService.getAll({ q, skip: 0, limit: 20 })
      client.get('/products', { params })                       ← Layer 2 → 1

4. client request interceptor adds  Authorization: Bearer <token>
      → GET https://dummyjson.com/products?skip=0&limit=20      ← Layer 1 → server

5. Response comes back
      • success → data flows back up: service → hook (cached) → screen re-renders
      • error   → response interceptor: 401? signOut(). Make message readable.
                  → hook sets isError → screen shows error + Retry button
```

## 3.3 What happens on a change (mutation)

When the user taps **Save** on the edit screen:

```
ProductEditScreen
   └─ updateProduct.mutate(values)                        (useUpdateProduct in api.ts)
        └─ productService.update(id, input)               (PUT /products/:id)
             └─ client → server
        onSuccess:
           setQueryData(['products','detail',id], updated)   → detail screen updates instantly
           invalidateQueries(['products','list'])            → lists refetch in background
   └─ router.back()  + success toast
```

## 3.4 Full CRUD map of the Products feature

```
 Products tab (list) ──tap card──▶ /product/:id (detail) ──Edit──▶ /product/:id/edit ──Save──▶ useUpdateProduct ──▶ back
      │                                   │
      │                                 Delete ──confirm──▶ useDeleteProduct ──▶ back (list refreshes)
      │
   "Add" (header) ──▶ /product/add ──Create──▶ useCreateProduct ──▶ back (list refreshes)
```

## 3.5 Rules that keep the architecture clean

1. A screen **never** imports `axios` or `client`.
2. A service **never** imports React or React Query.
3. Server data is **never** copied into `useState` or Zustand — React Query is the store.
4. Every data screen handles **4 states**: ⏳ loading · ❌ error (with retry) · 📭 empty · ✅ success.
5. After every mutation, **invalidate** (or update) the affected query keys.

> 🧠 Before writing code, ask: *"Which layer does this belong to?"* If you can't answer, ask a teammate.
