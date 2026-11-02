import type { Product, ProductInput } from './types';

import * as z from 'zod';

/**
 * Form validation for create + edit.
 *
 * Text inputs always give us strings, so numeric fields are validated
 * as strings here and converted to numbers in `toProductInput`.
 * See docs/07-forms-and-validation.md
 */
function isPositiveNumber(value: string) {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0;
}

function isWholeNumber(value: string) {
  const n = Number(value);
  return value.trim() !== '' && Number.isInteger(n) && n >= 0;
}

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.string().refine(isPositiveNumber, 'Price must be a number greater than 0'),
  stock: z.string().refine(isWholeNumber, 'Stock must be a whole number (0 or more)'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const emptyProductForm: ProductFormValues = {
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
};

/** Form values (strings) → API payload (numbers) */
export function toProductInput(values: ProductFormValues): ProductInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
  };
}

/** API product → form values, used to pre-fill the edit form */
export function toProductFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    description: product.description,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
  };
}
