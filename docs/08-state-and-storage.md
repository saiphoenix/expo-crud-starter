# 8. State & Storage — Where Does Data Live?

← [Forms](./07-forms-and-validation.md) · Next: [UI, Styling & i18n](./09-ui-styling-i18n.md) →

## 8.1 The decision table

| Kind of data | Example | Where | Reference |
|---|---|---|---|
| **Server data** | products, orders, profile | **React Query** | `features/products/api.ts` |
| **Global app state** | signed-in status, token | **Zustand** | `features/auth/use-auth-store.tsx` |
| **Saved on device** | token, theme, language, "seen onboarding" | **MMKV** | `lib/storage.tsx` |
| **Screen-only state** | search text, modal open | `useState` | `product-list-screen.tsx` (`search`) |
| **Form state** | input values, errors | **TanStack Form** | `components/product-form.tsx` |
| **URL state** | which product is open | route params | `useLocalSearchParams()` |

> ❗ **#1 beginner mistake:** fetching data and copying it into `useState` or Zustand. React Query **is** the store for server data. Copies get out of date.

## 8.2 Zustand (global app state)

```ts
const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => { setToken(token); set({ status: 'signIn', token }); },
  signOut: () => { removeToken(); set({ status: 'signOut', token: null }); },
  hydrate: () => { /* read token from MMKV on app start */ },
}));

export const useAuthStore = createSelectors(_useAuthStore);
export const signOut = () => _useAuthStore.getState().signOut();   // usable outside React (e.g. interceptor)
```

Using it in a component — select **only** what you need:

```tsx
const status = useAuthStore.use.status();   // re-renders only when status changes
const signOut = useAuthStore.use.signOut();
```

`hydrateAuth()` runs once in `src/app/_layout.tsx` so the user stays logged in after restarting the app.

## 8.3 MMKV (device storage)

[`src/lib/storage.tsx`](../src/lib/storage.tsx) wraps [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) — a fast, synchronous key-value store.

```ts
import { getItem, setItem, removeItem } from '@/lib/storage';

setItem('has_seen_tip', true);
const seen = getItem<boolean>('has_seen_tip');
removeItem('has_seen_tip');
```

Values are JSON-serialised, so you can store objects. Don't use AsyncStorage.

> 🔒 **Security note:** MMKV is not encrypted unless you pass an encryption key. For production apps with sensitive data (refresh tokens, personal data), consider [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/) or an encrypted MMKV instance. Agree on this with your lead per project.
