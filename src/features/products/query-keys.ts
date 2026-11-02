/**
 * Query-key factory for the Products feature.
 *
 * Keys form a tree, so you can invalidate a whole branch at once:
 *
 *   ['products']                         ← productKeys.all
 *   ├── ['products', 'list']             ← productKeys.lists()
 *   │     └── ['products', 'list', { q }] ← productKeys.list({ q })
 *   └── ['products', 'detail']           ← productKeys.details()
 *         └── ['products', 'detail', 5]  ← productKeys.detail(5)
 *
 * Never type a key by hand in a screen — always use this file.
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { q?: string }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};
