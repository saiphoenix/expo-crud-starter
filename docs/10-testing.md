# 10. Testing

← [UI, Styling & i18n](./09-ui-styling-i18n.md) · Next: [Code Quality & Git](./11-code-quality-and-git.md) →

## 10.1 What we test

| What | Tool | Example in this repo |
|---|---|---|
| Pure logic: schemas, converters, key factories | Jest | `products/schema.test.ts`, `products/query-keys.test.ts` |
| Services (right URL + params) | Jest + mocked client | `products/service.test.ts` |
| Components: renders + interactions | Jest + React Native Testing Library | `products/components/product-card.test.tsx` |
| Forms: validation + submit | Jest + RNTL | `products/components/product-form.test.tsx`, `auth/components/login-form.test.tsx` |
| Full user journeys on a real app | [Maestro](https://docs.maestro.dev) | `.maestro/products/products-crud.yaml` |

Tests live **next to the file** they test: `product-card.tsx` → `product-card.test.tsx`.

## 10.2 Running tests

```bash
pnpm test              # all unit tests once
pnpm test:watch        # re-run on save
pnpm test product      # only files matching "product"
pnpm test:ci           # with coverage (what CI runs)
```

## 10.3 Unit test — pure functions

```ts
import { productSchema } from './schema';

it('rejects a zero price', () => {
  expect(productSchema.safeParse({ ...valid, price: '0' }).success).toBe(false);
});
```

## 10.4 Service test — mock the client

```ts
jest.mock('@/lib/api', () => ({ client: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() } }));

it('getAll calls /products/search when there is a query', async () => {
  mockedClient.get.mockResolvedValueOnce({ data: { products: [], total: 0, skip: 0, limit: 20 } });
  await productService.getAll({ q: 'phone' });
  expect(mockedClient.get).toHaveBeenCalledWith('/products/search', { params: { q: 'phone', skip: 0, limit: 20 } });
});
```

We never call the real API in unit tests.

## 10.5 Component test — use `setup` from test-utils

`src/lib/test-utils.tsx` wraps components in the providers they need and gives you a `user` for realistic interactions.

```tsx
import { screen, setup } from '@/lib/test-utils';

it('calls onPress with the product', async () => {
  const onPress = jest.fn();
  const { user } = setup(<ProductCard product={product} onPress={onPress} />);
  await user.press(screen.getByTestId('product-card-1'));
  expect(onPress).toHaveBeenCalledWith(product);
});
```

Find elements by what the user sees (`getByText`, `getByRole`) or by `testID` for inputs/buttons.

## 10.6 End-to-end with Maestro

Maestro drives the real app on a simulator/emulator like a user would.

```bash
pnpm install-maestro                # once
pnpm android                        # have the development build running
pnpm e2e-test                       # runs every flow in .maestro/
maestro test .maestro/products/products-crud.yaml -e APP_ID=com.obytes.development   # one flow
```

A flow is YAML:

```yaml
- tapOn:
    id: products-tab
- tapOn:
    id: product-card-1
- assertVisible:
    id: product-detail-title
```

Reusable steps (onboarding, login, hide keyboard) live in `.maestro/utils/`.

## 10.7 Minimum for every feature PR

- [ ] Schema / converters tested
- [ ] Service URLs tested
- [ ] Key components tested (render + main interaction)
- [ ] One Maestro flow for the main happy path (for big features)
