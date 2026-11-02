import type {
  Product,
  ProductInput,
  ProductListParams,
  ProductListResponse,
} from './types';

import { client } from '@/lib/api';

/**
 * LAYER 2 — SERVICE
 *
 * One plain async function per backend endpoint.
 * No React, no hooks, no UI — just "call this URL, return this data".
 * If the backend changes a URL, this is the only file you edit.
 * See docs/04-api-layer.md
 */
export const productService = {
  // READ — list (with optional search + pagination)
  getAll: async ({ q, skip = 0, limit = 20 }: ProductListParams) => {
    const url = q ? '/products/search' : '/products';
    const { data } = await client.get<ProductListResponse>(url, {
      params: { q, skip, limit },
    });
    return data;
  },

  // READ — single item
  getById: async (id: number) => {
    const { data } = await client.get<Product>(`/products/${id}`);
    return data;
  },

  // CREATE
  create: async (input: ProductInput) => {
    const { data } = await client.post<Product>('/products/add', input);
    return data;
  },

  // UPDATE
  update: async (id: number, input: Partial<ProductInput>) => {
    const { data } = await client.put<Product>(`/products/${id}`, input);
    return data;
  },

  // DELETE
  remove: async (id: number) => {
    const { data } = await client.delete<Product>(`/products/${id}`);
    return data;
  },
};
