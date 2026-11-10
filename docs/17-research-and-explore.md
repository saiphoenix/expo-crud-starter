# 17 · Research & Explore Guide

This repo uses many libraries and ideas. This page lists **every one of them** with:
- **what** it is (one line),
- **where** it's used in this repo (open that file first),
- **what to research** (questions to answer yourself),
- the **official docs**.

**How to use it:** pick one row a day (or as your mentor assigns). Read the file in the repo, then the docs, then answer the questions in your own notes. Then **change something and see what breaks**. That's the fastest way to learn.

> ✅ Done well, you should be able to explain any row to a teammate in 2 minutes without notes.

---

## A. Core platform

| Topic | Where in this repo | Research questions | Docs |
|---|---|---|---|
| **React Native** | everything in `src/` | How do `View`/`Text` become native views? What runs on the JS thread vs the UI thread? What is the "New Architecture" (Fabric, TurboModules, JSI)? | https://reactnative.dev/docs/getting-started |
| **Expo (SDK 54)** | `app.config.ts`, `package.json` | Expo Go vs a **development build**: why can't this app run in Expo Go? What does `expo prebuild` generate? | https://docs.expo.dev |
| **Expo dev client** | `expo-dev-client` in `package.json` | What extra tools does it give you? When do you need to rebuild it (native change) vs just reload (JS change)? | https://docs.expo.dev/develop/development-builds/introduction/ |
| **Metro bundler** | `metro.config.js` | What does Metro do? Why does `-c` (clear cache) fix "weird" bugs? When are `.env` values baked in? | https://metrobundler.dev |
| **Hermes** | default JS engine | Why does RN use Hermes instead of a browser engine? What is bytecode precompilation? | https://reactnative.dev/docs/hermes |
| **TypeScript** | `tsconfig.json`, all `.ts/.tsx` | `type` vs `interface`; `Pick`, `Partial`, `Omit`; generics like `client.get<Product>()`; what is `z.infer`? | https://www.typescriptlang.org/docs/handbook/ |
| **React 19 + React Compiler** | `eslint-plugin-react-compiler` | What does the compiler auto-memoize? When do you still need `useMemo`/`useCallback`? | https://react.dev/learn/react-compiler |

## B. Navigation

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **Expo Router** (file-based routing) | `src/app/` | How does a file path become a URL? What do `_layout.tsx`, `(app)` groups and `[id]` mean? | https://docs.expo.dev/router/introduction/ |
| Tabs & Stack | `src/app/(app)/_layout.tsx`, `src/app/_layout.tsx` | Why are product detail/edit screens **outside** the `(app)` tabs group? | https://docs.expo.dev/router/advanced/tabs/ |
| Route params | `src/app/product/[id]/index.tsx` | `useLocalSearchParams` vs `useGlobalSearchParams`. Why do we convert `id` with `Number()`? | https://docs.expo.dev/router/reference/url-parameters/ |
| Auth guard / redirects | `src/app/(app)/_layout.tsx` | How does `<Redirect>` protect screens? What happens on app start when the token exists? | https://docs.expo.dev/router/advanced/authentication/ |
| Deep linking | `scheme` in `app.config.ts` | Open `obytesApp://product/3` from the terminal with `xcrun simctl openurl booted ...`. What happens? | https://docs.expo.dev/linking/overview/ |

## C. Data & networking (the most important section)

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **REST & HTTP basics** | `mock-api/server.js` | GET/POST/PUT/PATCH/DELETE. Status codes 200, 201, 400, 401, 404, 409, 500. PUT vs PATCH? | https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview |
| **Axios** | `src/lib/api/client.tsx` | What is an **interceptor**? Why add the token in one place? What does `timeout` do? | https://axios-http.com/docs/intro |
| Service layer | `src/features/products/service.ts` | Why keep URLs out of screens? What changes if the backend renames an endpoint? | [04 · API Layer](./04-api-layer.md) |
| **TanStack Query** (React Query) | `src/features/products/api.ts` | Query vs mutation; `staleTime` vs `gcTime`; what does `invalidateQueries` do? Why `useInfiniteQuery` for the list? | https://tanstack.com/query/latest/docs/framework/react/overview |
| Query keys | `src/features/products/query-keys.ts` | Why a key "factory"? What gets refetched when you invalidate `productKeys.lists()`? | https://tkdodo.eu/blog/effective-react-query-keys |
| Cache updates | `useUpdateProduct` in `api.ts` | `setQueryData` vs `invalidateQueries`: when to use each? What is an **optimistic update**? | https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates |
| react-query-kit | `src/features/feed/api.ts` (template's older style) | Compare it with our plain hooks in `products/api.ts`. Which is easier to read? | https://github.com/liaoliao666/react-query-kit |
| React Query devtools | `@dev-plugins/react-query` | Open it with `shift+m` in the Metro terminal and watch queries go fresh → stale → refetch | https://docs.expo.dev/debugging/devtools-plugins/ |
| **Local mock API** | `mock-api/` | Read `server.js`. Where does it validate? Why does the server, not the app, choose `id`? | [16 · Mock API](./16-mock-api.md) |

## D. Forms & validation

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **TanStack Form** | `src/features/products/components/product-form.tsx` | How does `form.Field` work? When do validators run (`onChange` vs `onSubmit`)? | https://tanstack.com/form/latest/docs/overview |
| **Zod** | `src/features/products/schema.ts`, `env.ts` | Why validate price as a **string** in the form and convert later? What does `safeParse` return? | https://zod.dev |
| Keyboard handling | `react-native-keyboard-controller` | Why doesn't the keyboard cover inputs? What's `KeyboardAwareScrollView`? | https://kirillzyusko.github.io/react-native-keyboard-controller/ |

## E. State & storage

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **Zustand** | `src/features/auth/use-auth-store.tsx` | Why is auth in Zustand but products are not? What's a selector and why use one? | https://zustand.docs.pmnd.rs |
| **MMKV** | `src/lib/storage.tsx` | MMKV vs AsyncStorage. Why is it sync? Is it safe for passwords? (Research `expo-secure-store`.) | https://github.com/mrousavy/react-native-mmkv |
| Server state vs client state | [08 · State & Storage](./08-state-and-storage.md) | Make a table: 5 pieces of data in this app → where each lives and why | — |

## F. UI, styling, lists

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **Uniwind** (Tailwind v4 for RN) | `className=` everywhere, `src/global.css` | How do `dark:` classes work? How is it different from NativeWind? | https://docs.uniwind.dev |
| tailwind-variants / tailwind-merge | `src/components/ui/button.tsx` | What problem do "variants" solve? Why merge class names? | https://www.tailwind-variants.org |
| UI kit | `src/components/ui/` | List every component. Which ones does the products feature use? | — |
| **FlashList** | `product-list-screen.tsx` | Why FlashList instead of `FlatList`/`ScrollView.map`? What is cell recycling? `onEndReached` for pagination? | https://shopify.github.io/flash-list/ |
| expo-image | `src/components/ui/image.tsx` (used by `product-card.tsx`) | Caching, placeholders, `contentFit`. Why not RN's `<Image>`? | https://docs.expo.dev/versions/latest/sdk/image/ |
| Reanimated / Moti / Gesture Handler | `package.json`, onboarding screens | UI-thread animations: what is a **worklet**? | https://docs.swmansion.com/react-native-reanimated/ |
| Bottom sheet | `@gorhom/bottom-sheet`, `src/components/ui/modal.tsx` | Where does the template use it? | https://gorhom.dev/react-native-bottom-sheet/ |
| SVG icons | `src/components/ui/icons/` | How is an SVG turned into a component? | https://github.com/software-mansion/react-native-svg |
| Toasts | `react-native-flash-message`, `showErrorMessage` in `src/components/ui/utils.tsx` | Where do success/error toasts come from after a mutation? | https://github.com/lucasferreira/react-native-flash-message |
| Safe areas & edge-to-edge | `react-native-safe-area-context`, `react-native-edge-to-edge` | What's a notch inset? Why does content hide behind the status bar without it? | https://docs.expo.dev/develop/user-interface/safe-areas/ |
| Accessibility | `accessibilityRole`/`Label` in `product-card.tsx` | Turn on VoiceOver in the simulator. Can you use the app? | https://reactnative.dev/docs/accessibility |

## G. Internationalisation

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **i18next** | `src/lib/i18n/`, `src/translations/en.json`, `ar.json` | How does `translate('products.form.title')` find text? What breaks in **RTL** (Arabic)? Switch language in Settings and check | https://www.i18next.com |
| expo-localization | `src/lib/i18n/` | How does the app pick the device language? | https://docs.expo.dev/versions/latest/sdk/localization/ |

## H. Testing

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **Jest** | `jest.config.js`, `*.test.ts(x)` | What's a mock? Why does `service.test.ts` mock `@/lib/api`? | https://jestjs.io/docs/getting-started |
| **React Native Testing Library** | `product-form.test.tsx` | Why query by text/testID instead of component internals? `getBy` vs `queryBy` vs `findBy`? | https://callstack.github.io/react-native-testing-library/ |
| **Maestro** (E2E) | `.maestro/products/products-crud.yaml` | Read the flow. Add a step that edits a product and checks "Product updated" | https://maestro.mobile.dev |

## I. Code quality & workflow

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| **ESLint** (@antfu config) | `eslint.config.mjs` | Why no Prettier? What does `pnpm lint:fix` fix automatically? | https://github.com/antfu/eslint-config |
| **Husky + lint-staged** | `.husky/`, `lint-staged.config.js` | What runs when you `git commit`? Why only staged files? | https://typicode.github.io/husky/ |
| **commitlint / Conventional Commits** | `commitlint.config.js` | Write 5 example messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:` | https://www.conventionalcommits.org |
| pnpm | `pnpm-lock.yaml` | Why pnpm over npm? What is a lockfile for? | https://pnpm.io/motivation |

## J. Environments, builds, release

| Topic | Where | Research questions | Docs |
|---|---|---|---|
| Env vars | `env.ts`, `.env` | Why must app vars start with `EXPO_PUBLIC_`? Why are they **not secret**? | https://docs.expo.dev/guides/environment-variables/ |
| App config | `app.config.ts` | Bundle ID / package name: why must they be unique per app? | https://docs.expo.dev/workflow/configuration/ |
| **EAS Build / Submit** | `eas.json` | What's a build profile? What's the difference between development, preview and production? | https://docs.expo.dev/build/introduction/ |
| **EAS Update** (OTA) | [12 · Environments & Builds](./12-environments-and-builds.md) | What can an OTA update change, and what can't it? What's a runtime version? | https://docs.expo.dev/eas-update/introduction/ |

---

## Weekly research assignment (suggested)

| Week | Sections | Show-and-tell deliverable |
|---|---|---|
| 1 | A, B | Draw the folder → URL map for every file in `src/app/` |
| 2 | C, E | Explain on a whiteboard what happens from tapping **Save Changes** to `db.json` changing (every layer, every file) |
| 3 | D, F, G | Add a `brand` field end to end (see [16 · Mock API exercises](./16-mock-api.md#165-exercises)) with tests |
| 4 | H, I, J | Build a second CRUD feature against the mock API, with unit tests, a Maestro flow and a clean PR |

## The "trace one tap" exercise (do this first)

Put a `console.log` in each of these and tap **Save Changes** on the edit screen. Then read the logs in order:

1. `src/features/products/product-edit-screen.tsx`: the `onSubmit` prop on `<ProductForm>`
2. `src/features/products/schema.ts`: `toProductInput`
3. `src/features/products/api.ts`: `useUpdateProduct`'s `mutationFn`
4. `src/features/products/service.ts`: `productService.update`
5. `src/lib/api/client.tsx`: the request interceptor
6. Terminal 1 (mock server): `PUT /products/5 → 200`
7. `mock-api/db.json`: the changed object
8. `api.ts`: `onSuccess` → `setQueryData` + `invalidateQueries`
9. The list screen refetches → `GET /products?skip=0&limit=20`

If you can explain all 9 steps, you understand how this app works.
