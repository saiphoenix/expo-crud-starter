# 7. Forms & Validation

← [Routing](./06-routing-navigation.md) · Next: [State & Storage](./08-state-and-storage.md) →

We use **[TanStack Form](https://tanstack.com/form/latest)** for form state and **[Zod](https://zod.dev)** for validation rules. (Not react-hook-form.)

Reference files:
- Schema: [`src/features/products/schema.ts`](../src/features/products/schema.ts)
- Form: [`src/features/products/components/product-form.tsx`](../src/features/products/components/product-form.tsx)
- Template's original example: `src/features/auth/components/login-form.tsx`

## 7.1 Step 1 — The schema (rules)

```ts
export const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.string().refine(isPositiveNumber, 'Price must be a number greater than 0'),
  stock: z.string().refine(isWholeNumber, 'Stock must be a whole number (0 or more)'),
});

export type ProductFormValues = z.infer<typeof productSchema>;  // the type comes FROM the schema
```

> **Why are price and stock strings?** A `TextInput` always gives you a string. We validate the string in the form and convert to numbers only when sending to the API.

## 7.2 Step 2 — Converters (form ↔ API)

```ts
toProductInput(values)        // form strings  → API payload with numbers   (on submit)
toProductFormValues(product)  // API product   → form strings              (pre-fill edit)
```

Keeping these as tiny pure functions makes them trivial to unit-test (`schema.test.ts`).

## 7.3 Step 3 — One reusable form for create AND edit

The form component **doesn't know about the API**. It receives:

```ts
type ProductFormProps = {
  defaultValues?: ProductFormValues;   // empty for create, pre-filled for edit
  submitLabel: string;                 // "Create Product" / "Save Changes"
  submitting?: boolean;                // shows the spinner
  onSubmit: (values: ProductFormValues) => void;
};
```

Inside:

```tsx
const form = useForm({
  defaultValues,
  validators: { onChange: productSchema as any },
  onSubmit: ({ value }) => onSubmit(value),
});

<form.Field
  name="title"
  children={field => (
    <Input
      testID="product-title-input"
      label={translate('products.form.title')}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChangeText={field.handleChange}
      error={getFieldError(field)}        // shows the Zod message once the field is touched
    />
  )}
/>

<Button label={submitLabel} loading={submitting} onPress={form.handleSubmit} />
```

## 7.4 Step 4 — The screen decides what "submit" means

```tsx
// Create
<ProductForm submitLabel="Create Product" submitting={createProduct.isPending}
  onSubmit={values => createProduct.mutate(toProductInput(values), { onSuccess, onError })} />

// Edit
<ProductForm defaultValues={toProductFormValues(product)} submitLabel="Save Changes"
  submitting={updateProduct.isPending}
  onSubmit={values => updateProduct.mutate(toProductInput(values), { onSuccess, onError })} />
```

## 7.5 Form UX checklist

- [ ] Correct keyboard: `keyboardType="decimal-pad"` for prices, `"number-pad"` for counts, `"email-address"` for emails
- [ ] `autoCapitalize="none"` for emails, usernames, slugs
- [ ] The form scrolls above the keyboard (`KeyboardAwareScrollView`)
- [ ] Submit button shows a spinner and can't be double-tapped while saving
- [ ] Errors appear under the field, in text (not colour only)
- [ ] Every input has a `testID` for tests
