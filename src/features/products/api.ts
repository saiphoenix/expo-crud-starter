import type { AxiosError } from 'axios';
import type { Product, ProductInput, ProductListResponse } from './types';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { productKeys } from './query-keys';
import { productService } from './service';

/**
 * LAYER 3 — REACT QUERY HOOKS
 *
 * Screens call these hooks. Hooks call the service.
 * React Query handles caching, loading/error state, retries and refetching.
 * See docs/05-react-query.md
 */

export const PRODUCTS_PAGE_SIZE = 20;

// ── READ: paginated list with search (infinite scroll) ────────────────────
export function useProducts(q?: string) {
  return useInfiniteQuery<ProductListResponse, AxiosError>({
    queryKey: productKeys.list({ q }),
    queryFn: ({ pageParam }) =>
      productService.getAll({
        q,
        skip: pageParam as number,
        limit: PRODUCTS_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined; // undefined = no more pages
    },
    staleTime: 60 * 1000, // list is "fresh" for 1 minute
  });
}

// ── READ: single product ──────────────────────────────────────────────────
export function useProduct(id: number) {
  return useQuery<Product, AxiosError>({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: Number.isFinite(id), // never fetch with a bad id from the URL
    staleTime: 5 * 60 * 1000, // details change less often
  });
}

// ── CREATE ────────────────────────────────────────────────────────────────
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError, ProductInput>({
    mutationFn: input => productService.create(input),
    onSuccess: () => {
      // Lists are now outdated → refetch them.
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// ── UPDATE ────────────────────────────────────────────────────────────────
export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError, Partial<ProductInput>>({
    mutationFn: input => productService.update(id, input),
    onSuccess: (updated) => {
      // Put the server's answer straight into the detail cache (instant UI)…
      queryClient.setQueryData(productKeys.detail(id), updated);
      // …and mark lists as outdated.
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// ── DELETE ────────────────────────────────────────────────────────────────
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError, number>({
    mutationFn: id => productService.remove(id),
    onSuccess: (_deleted, id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
