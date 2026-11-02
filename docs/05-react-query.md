# 5. React Query (Layer 3)

← [API Layer](./04-api-layer.md) · Next: [Routing & Navigation](./06-routing-navigation.md) →

File: [`src/features/products/api.ts`](../src/features/products/api.ts)

## 5.1 Why React Query?

Without it, every screen needs `useState` for data, loading and error, a `useEffect` to fetch, logic to refetch, to avoid double-fetching, to retry… React Query does all of that, **and caches** the result so the next screen gets it instantly.

## 5.2 Five words to learn

| Word | Meaning |
|---|---|
| **Query** | Reading data (GET) → `useQuery` / `useInfiniteQuery` |
| **Mutation** | Changing data (POST/PUT/DELETE) → `useMutation` |
| **Query key** | The unique name of cached data, e.g. `['products', 'detail', 5]` |
| **Stale** | Cached data that *might* be outdated → refetched in the background |
| **Invalidate** | "This is outdated — refetch it." Used after mutations |

Two settings matter most:
- **`staleTime`** — how long data stays fresh (no background refetch). Default `0`. We use 1 min for lists, 5 min for details.
- **`gcTime`** — how long unused data stays in memory. Default 5 min.

The `QueryClient` lives in [`src/lib/api/provider.tsx`](../src/lib/api/provider.tsx) and wraps the app in `src/app/_layout.tsx`.

## 5.3 Query keys — always use the factory

File: [`src/features/products/query-keys.ts`](../src/features/products/query-keys.ts)

```ts
export const productKeys = {
  all:     ['products'],
  lists:   () => [...productKeys.all, 'list'],
  list:    (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail:  (id) => [...productKeys.details(), id],
};
```

Keys are a **tree**. Invalidating a branch refreshes everything under it:

```
['products']                         invalidate → EVERYTHING about products
 ├── ['products','list']             invalidate → every list/search result
 │     └── ['products','list',{q}]
 └── ['products','detail']
       └── ['products','detail',5]   invalidate → just product 5
```

## 5.4 Reading data

```ts
// Single item
export function useProduct(id: number) {
  return useQuery<Product, AxiosError>({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: Number.isFinite(id),   // don't fetch with a bad id
    staleTime: 5 * 60 * 1000,
  });
}

// Paginated list (infinite scroll)
export function useProducts(q?: string) {
  return useInfiniteQuery<ProductListResponse, AxiosError>({
    queryKey: productKeys.list({ q }),
    queryFn: ({ pageParam }) => productService.getAll({ q, skip: pageParam as number, limit: 20 }),
    initialPageParam: 0,
    getNextPageParam: last => (last.skip + last.limit < last.total ? last.skip + last.limit : undefined),
  });
}
```

In the screen:

```tsx
const { data, isPending, isError, error, refetch,
        fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(q);

const products = data?.pages.flatMap(page => page.products) ?? [];

onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
```

> The `!isFetchingNextPage` guard matters — without it the same page can load twice and you'll see duplicate items.

## 5.5 Changing data (mutations)

```ts
export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError, Partial<ProductInput>>({
    mutationFn: input => productService.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(id), updated);           // instant UI
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });    // refetch lists
    },
  });
}
```

| Mutation | After success |
|---|---|
| Create | `invalidateQueries(lists())` |
| Update | `setQueryData(detail(id))` + `invalidateQueries(lists())` |
| Delete | `removeQueries(detail(id))` + `invalidateQueries(lists())` |

**Where do side effects go?**
- Cache updates (invalidate / setQueryData) → in the hook (`api.ts`), so every screen gets them.
- UI reactions (toast, navigate back) → in the screen, via `mutate(vars, { onSuccess, onError })`.

```tsx
createProduct.mutate(toProductInput(values), {
  onSuccess: () => { showMessage({ message: 'Product created', type: 'success' }); router.back(); },
  onError: e => showErrorMessage(e.message),
});
```

## 5.6 Plain React Query vs `react-query-kit`

The template's **Feed** example (`src/features/feed/api.ts`) uses [`react-query-kit`](https://github.com/liaoliao666/react-query-kit) (`createQuery`, `createMutation`), a thin helper on top of React Query. **Products uses plain React Query** because it's easier to learn and maps 1:1 to the official docs. Both are fine; for new features **follow the Products pattern**.

## 5.7 Debugging the cache

With the app running, press `shift + m` in the Metro terminal and open the **React Query** dev tools plugin (wired via `@dev-plugins/react-query` in `provider.tsx`). You can see every key, its data, and whether it's fresh or stale.

> 🔜 Deep dives later: optimistic updates, prefetching on press, offline persistence.
