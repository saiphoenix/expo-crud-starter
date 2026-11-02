/**
 * Data shapes for the Products feature.
 * They mirror the API response — see https://dummyjson.com/docs/products
 */
export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
};

/** What GET /products and GET /products/search return */
export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

/** What we SEND when creating or updating a product */
export type ProductInput = Pick<
  Product,
  'title' | 'description' | 'category' | 'price' | 'stock'
>;

/** Query params for the list endpoint */
export type ProductListParams = {
  q?: string;
  skip?: number;
  limit?: number;
};
