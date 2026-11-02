# 6. Routing & Navigation (Layer 4 entry points)

← [React Query](./05-react-query.md) · Next: [Forms & Validation](./07-forms-and-validation.md) →

We use **[Expo Router](https://docs.expo.dev/router/introduction/)**: the file path inside `src/app/` **is** the screen's URL.

## 6.1 Our routes

| File | URL | Screen |
|---|---|---|
| `app/_layout.tsx` | — | Root stack + all providers |
| `app/onboarding.tsx` | `/onboarding` | First-launch onboarding |
| `app/login.tsx` | `/login` | Login |
| `app/(app)/_layout.tsx` | — | Bottom tabs + **auth guard** |
| `app/(app)/index.tsx` | `/` | Feed tab |
| `app/(app)/products.tsx` | `/products` | **Products tab (list)** |
| `app/(app)/style.tsx` | `/style` | UI kit demo |
| `app/(app)/settings.tsx` | `/settings` | Settings |
| `app/product/add.tsx` | `/product/add` | **Create product** |
| `app/product/[id]/index.tsx` | `/product/5` | **Product detail** |
| `app/product/[id]/edit.tsx` | `/product/5/edit` | **Edit product** |
| `app/[...messing].tsx` | anything else | Not found |

### The special names

| Syntax | Meaning |
|---|---|
| `_layout.tsx` | Wraps every screen in its folder (stack, tabs, guard) |
| `(app)` | A **group** — shares a layout but is **not** in the URL |
| `[id]` | A **dynamic** segment — read it with `useLocalSearchParams()` |
| `[...messing]` | Catch-all — matches any unknown path |
| `index.tsx` | The default screen of a folder |

### Why are product detail screens outside `(app)`?

Screens inside `(app)/` show the **tab bar**. Detail/form screens should cover the whole screen with a back button, so they live in `app/product/` and are pushed on the **root stack**, on top of the tabs. This is the same pattern as the template's `app/feed/`.

## 6.2 Route files are ONE line

```tsx
// src/app/product/[id]/edit.tsx
export { ProductEditScreen as default } from '@/features/products/product-edit-screen';
```

No logic, no styles, no hooks in `src/app/`. All of that lives in `src/features/`.

## 6.3 Navigating

```tsx
import { Link, useRouter } from 'expo-router';

const router = useRouter();
router.push(`/product/${id}`);        // go forward (adds to history)
router.replace('/login');             // go without allowing "back"
router.back();                        // go back

<Link href="/product/add" asChild>    // declarative — wraps a Pressable
  <Pressable><Text>Add</Text></Pressable>
</Link>
```

Reading the URL param:

```tsx
const { id } = useLocalSearchParams<{ id: string }>();  // always a string!
const productId = Number(id);
```

## 6.4 Setting the header from a screen

```tsx
import { Stack } from 'expo-router';

<Stack.Screen options={{ title: translate('products.edit_title') }} />
```

Tab titles, icons and header buttons are set in `app/(app)/_layout.tsx` (see the `products` tab and its `AddProductLink`).

## 6.5 The auth guard

`app/(app)/_layout.tsx`:

```tsx
const status = useAuth.use.status();
const [isFirstTime] = useIsFirstTime();

if (isFirstTime) return <Redirect href="/onboarding" />;
if (status === 'signOut') return <Redirect href="/login" />;
return <Tabs>…</Tabs>;
```

Every screen inside `(app)` is protected automatically. When the API returns 401, the client interceptor calls `signOut()` → `status` becomes `signOut` → this guard redirects to `/login`. Individual screens never check auth themselves.

## 6.6 Adding a new tab

1. Create `src/app/(app)/orders.tsx` (one-line re-export)
2. Add a `<Tabs.Screen name="orders" options={{ title, tabBarIcon, tabBarButtonTestID }} />` in `app/(app)/_layout.tsx`
3. Icons live in `src/components/ui/icons/`
