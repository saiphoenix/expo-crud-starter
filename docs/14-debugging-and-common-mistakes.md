# 14. Debugging & Common Mistakes

← [Adding a New Feature](./13-adding-a-new-feature.md) · Next: [Glossary](./15-glossary.md) →

## 14.1 Debugging in 6 steps

1. **Read the error.** The first line + the first file from `src/` in the stack trace usually say exactly what's wrong.
2. **React Native DevTools** — press `j` in the Metro terminal: console, breakpoints, component tree, network.
3. **Check the request** — URL, status code, response body (DevTools Network tab, or a temporary `console.log` in the client interceptor).
4. **Check the cache** — press `shift + m` in Metro → React Query plugin. Is the key what you expect? Is there data?
5. **Clear caches** — `pnpm start -c`.
6. **Native error after installing a package?** Rebuild the dev client: `pnpm android` / `pnpm ios` (or `pnpm prebuild` first).

## 14.2 Symptom → cause

| Symptom | Likely cause |
|---|---|
| `Network Error` calling `localhost` from Android emulator | Emulator's `localhost` is itself — use `10.0.2.2` or your machine's LAN IP |
| Data doesn't update after create/update/delete | Missing `invalidateQueries`, or a hand-typed key that doesn't match |
| Duplicate items in an infinite list | `fetchNextPage` without the `!isFetchingNextPage` guard |
| `Cannot read property 'title' of undefined` | Used `data` before checking `isPending` / `isError` |
| Created product not in list / 404 on its detail | You're on DummyJSON, which doesn't really save. Use the local mock API ([16 · Mock API](./16-mock-api.md)) |
| `Network Error` / "No internet connection" on every screen | Mock API not running → `pnpm mock:api`. On Android emulator use `http://10.0.2.2:3001/`. Changed `.env`? → `pnpm start -c` |
| Env var is `undefined` / validation warning | Not in `.env` **and** `env.ts`, or Metro not restarted with `-c` |
| `requireNativeComponent` / "native module not found" | Native library added but dev client not rebuilt |
| Commit blocked: "Direct commits to the main branch…" | You're on `main` — create a branch |
| Commit blocked by commitlint | Message isn't `type: description` |
| `pnpm install` says "use pnpm" | You ran `npm install` — use `pnpm` |
| Every `pnpm` command first tries to download another pnpm version and fails (401 / network) | `package.json` pins `packageManager: pnpm@10.x`. Install that version (`corepack enable`), or run with `npm_config_manage_package_manager_versions=false`. If your global `~/.npmrc` points to a private registry, add `--registry=https://registry.npmjs.org/` to the install |
| Translation key TypeScript error | Key missing in `en.json`, or typo |

## 14.3 Common mistakes

| ❌ Don't | ✅ Do |
|---|---|
| Call `axios` / `fetch` in a screen | Screen → hook → service → client |
| Create a second axios instance | Use `client` from `@/lib/api` |
| Store API data in `useState` / Zustand | Use React Query |
| Skip loading / error / empty states | Handle all 4 states |
| Put logic in `src/app/` route files | One-line re-exports only |
| Hand-type query keys | Use the key factory |
| Forget invalidation after a mutation | `invalidateQueries` in `onSuccess` |
| Hard-code API URLs | `Env.EXPO_PUBLIC_API_URL` + service paths |
| Put secrets in `EXPO_PUBLIC_*` | Secrets stay on the backend |
| Hard-code UI strings | `translate('key')` |
| Use array index as list key | Use the item `id` |
| `.map()` in a `ScrollView` for long lists | `FlashList` |
| Call the API on every keystroke | `useDebounce` |
| Copy a component into several features | Move it to `components/ui` |
| Create `index.ts` barrels in features | Import the exact file |
| Silence TypeScript with `any` / `@ts-ignore` | Fix the type — ask if stuck |
| `git commit --no-verify` | Fix what the checks found |
| Giant PRs | Small PRs, one task |
| Struggle silently for hours | Ask after 30 minutes 👇 |

## 14.4 Asking for help

Try for 30 minutes, then ask with this template:

```
Trying to:      load product details on the detail screen
Expected:       title shows
Actually:       red screen "Cannot read property 'title' of undefined"
Tried:          logged id → "5"; GET /products/5 works in Postman
Branch / file:  feat/products-detail · product-detail-screen.tsx:42
Screenshot:     (attached)
```

AI assistants are welcome (see `claude.md` in the root), but **you must understand every line you commit**.
