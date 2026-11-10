# 17 · Research & Explore Guide

This repo uses many libraries and ideas. This page lists **every one of them** with:
- **what** it is (one line),
- **where** it's used in this repo (open that file first),
- **what to research** (questions to answer yourself),
- **what to read**: a specific article or guide for that topic.

**How to use it:** pick one row a day (or as your mentor assigns). Read the file in the repo, then the article, then answer the questions in your own notes. Then **change something and see what breaks**. That's the fastest way to learn.

> ✅ Done well, you should be able to explain any row to a teammate in 2 minutes without notes.

---

## A. Core platform

| Topic | Where in this repo | Research questions | Read |
|---|---|---|---|
| **React Native** | everything in `src/` | How do `View`/`Text` become native views? What runs on the JS thread vs the UI thread? What is the "New Architecture" (Fabric, TurboModules, JSI)? | [About the New Architecture](https://reactnative.dev/architecture/landing-page) |
| **Expo (SDK 54)** | `app.config.ts`, `package.json` | Expo Go vs a **development build**: why can't this app run in Expo Go? What does `expo prebuild` generate? | [Expo Go vs Development Builds](https://expo.dev/blog/expo-go-vs-development-builds) |
| **Expo dev client** | `expo-dev-client` in `package.json` | What extra tools does it give you? When do you need to rebuild it (native change) vs just reload (JS change)? | [Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/) |
| **Metro bundler** | `metro.config.js` | What does Metro do? Why does `-c` (clear cache) fix "weird" bugs? When are `.env` values baked in? | [Metro concepts](https://metrobundler.dev/docs/concepts) |
| **Hermes** | default JS engine | Why does RN use Hermes instead of a browser engine? What is bytecode precompilation? | [Using Hermes](https://reactnative.dev/docs/hermes) |
| **TypeScript** | `tsconfig.json`, all `.ts/.tsx` | `type` vs `interface`; `Pick`, `Partial`, `Omit`; generics like `client.get<Product>()`; what is `z.infer`? | [Type vs interface](https://www.totaltypescript.com/type-vs-interface-which-should-you-use) · [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) · [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) |
| **React 19 + React Compiler** | `eslint-plugin-react-compiler` | What does the compiler auto-memoize? When do you still need `useMemo`/`useCallback`? | [React Compiler introduction](https://react.dev/learn/react-compiler/introduction) |

## B. Navigation

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **Expo Router** (file-based routing) | `src/app/` | How does a file path become a URL? What do `_layout.tsx`, `(app)` groups and `[id]` mean? | [Core concepts of file-based routing](https://docs.expo.dev/router/basics/core-concepts/) |
| Tabs & Stack | `src/app/(app)/_layout.tsx`, `src/app/_layout.tsx` | Why are product detail/edit screens **outside** the `(app)` tabs group? | [Layouts](https://docs.expo.dev/router/basics/layout/) · [Tabs](https://docs.expo.dev/router/advanced/tabs/) |
| Route params | `src/app/product/[id]/index.tsx` | `useLocalSearchParams` vs `useGlobalSearchParams`. Why do we convert `id` with `Number()`? | [URL parameters](https://docs.expo.dev/router/reference/url-parameters/) |
| Auth guard / redirects | `src/app/(app)/_layout.tsx` | How does `<Redirect>` protect screens? What happens on app start when the token exists? | [Simplifying auth flows with protected routes](https://expo.dev/blog/simplifying-auth-flows-with-protected-routes) |
| Deep linking | `scheme` in `app.config.ts` | Open `obytesApp://product/3` from the terminal with `xcrun simctl openurl booted ...`. What happens? | [Linking overview](https://docs.expo.dev/linking/overview/) |

## C. Data & networking (the most important section)

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **REST & HTTP basics** | `mock-api/server.js` | GET/POST/PUT/PATCH/DELETE. Status codes 200, 201, 400, 401, 404, 409, 500. PUT vs PATCH? | [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) · [Status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) |
| **Axios** | `src/lib/api/client.tsx` | What is an **interceptor**? Why add the token in one place? What does `timeout` do? | [Axios interceptors](https://axios-http.com/docs/interceptors) |
| Service layer | `src/features/products/service.ts` | Why keep URLs out of screens? What changes if the backend renames an endpoint? | [04 · API Layer](./04-api-layer.md) |
| **TanStack Query** (React Query) | `src/features/products/api.ts` | Query vs mutation; `staleTime` vs `gcTime`; what does `invalidateQueries` do? Why `useInfiniteQuery` for the list? | [Practical React Query](https://tkdodo.eu/blog/practical-react-query) · [Mastering Mutations](https://tkdodo.eu/blog/mastering-mutations-in-react-query) |
| Query keys | `src/features/products/query-keys.ts` | Why a key "factory"? What gets refetched when you invalidate `productKeys.lists()`? | [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys) |
| Cache updates | `useUpdateProduct` in `api.ts` | `setQueryData` vs `invalidateQueries`: when to use each? What is an **optimistic update**? | [Automatic invalidation after mutations](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations) · [Concurrent optimistic updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query) |
| react-query-kit | `src/features/feed/api.ts` (template's older style) | Compare it with our plain hooks in `products/api.ts`. Which is easier to read? | [react-query-kit README](https://github.com/liaoliao666/react-query-kit) |
| React Query devtools | `@dev-plugins/react-query` | Open it with `shift+m` in the Metro terminal and watch queries go fresh → stale → refetch | [Dev tools plugins](https://docs.expo.dev/debugging/devtools-plugins/) |
| **Local mock API** | `mock-api/` | Read `server.js`. Where does it validate? Why does the server, not the app, choose `id`? | [16 · Mock API](./16-mock-api.md) |

## D. Forms & validation

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **TanStack Form** | `src/features/products/components/product-form.tsx` | How does `form.Field` work? When do validators run (`onChange` vs `onSubmit`)? | [Form and field validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation) |
| **Zod** | `src/features/products/schema.ts`, `env.ts` | Why validate price as a **string** in the form and convert later? What does `safeParse` return? | [Zod basic usage](https://zod.dev/basics) |
| Keyboard handling | `react-native-keyboard-controller` | Why doesn't the keyboard cover inputs? What's `KeyboardAwareScrollView`? | [Keyboard Controller components](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview) |

## E. State & storage

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **Zustand** | `src/features/auth/use-auth-store.tsx` | Why is auth in Zustand but products are not? What's a selector and why use one? | [Working with Zustand](https://tkdodo.eu/blog/working-with-zustand) · [useShallow](https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow) |
| **MMKV** | `src/lib/storage.tsx` | MMKV vs AsyncStorage. Why is it sync? Is it safe for passwords? (Research `expo-secure-store`.) | [Store data: MMKV vs AsyncStorage vs SecureStore](https://docs.expo.dev/develop/user-interface/store-data/) |
| Server state vs client state | [08 · State & Storage](./08-state-and-storage.md) | Make a table: 5 pieces of data in this app → where each lives and why | — |

## F. UI, styling, lists

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **Uniwind** (Tailwind v4 for RN) | `className=` everywhere, `src/global.css` | How do `dark:` classes work? How is it different from NativeWind? | [Uniwind theme variables](https://docs.uniwind.dev/theming/global-css) · [UI basics (doc 09)](./09-ui-styling-i18n.md) |
| tailwind-variants / tailwind-merge | `src/components/ui/button.tsx` | What problem do "variants" solve? Why merge class names? | [Tailwind Variants slots](https://www.tailwind-variants.org/docs/slots) |
| UI kit | `src/components/ui/` | List every component. Which ones does the products feature use? | — |
| **FlashList** | `product-list-screen.tsx` | Why FlashList instead of `FlatList`/`ScrollView.map`? What is cell recycling? `onEndReached` for pagination? | [FlashList performance](https://shopify.github.io/flash-list/docs/fundamentals/performance) |
| expo-image | `src/components/ui/image.tsx` (used by `product-card.tsx`) | Caching, placeholders, `contentFit`. Why not RN's `<Image>`? | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| Reanimated / Moti / Gesture Handler | `package.json`, onboarding screens | UI-thread animations: what is a **worklet**? | [Reanimated worklets](https://docs.swmansion.com/react-native-reanimated/docs/guides/worklets) |
| Bottom sheet | `@gorhom/bottom-sheet`, `src/components/ui/modal.tsx` | Where does the template use it? | [Bottom sheet docs](https://gorhom.dev/react-native-bottom-sheet/) |
| SVG icons | `src/components/ui/icons/` | How is an SVG turned into a component? | [react-native-svg README](https://github.com/software-mansion/react-native-svg) |
| Toasts | `react-native-flash-message`, `showErrorMessage` in `src/components/ui/utils.tsx` | Where do success/error toasts come from after a mutation? | [flash-message README](https://github.com/lucasferreira/react-native-flash-message) |
| Safe areas & edge-to-edge | `react-native-safe-area-context`, `react-native-edge-to-edge` | What's a notch inset? Why does content hide behind the status bar without it? | [Safe areas](https://docs.expo.dev/develop/user-interface/safe-areas/) · [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout) |
| Accessibility | `accessibilityRole`/`Label` in `product-card.tsx` | Turn on VoiceOver in the simulator. Can you use the app? | [RN accessibility](https://reactnative.dev/docs/accessibility) · [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) |

## G. Internationalisation

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **i18next** | `src/lib/i18n/`, `src/translations/en.json`, `ar.json` | How does `translate('products.form.title')` find text? What breaks in **RTL** (Arabic)? Switch language in Settings and check | [i18next interpolation](https://www.i18next.com/translation-function/interpolation) · [Plurals](https://www.i18next.com/translation-function/plurals) |
| expo-localization | `src/lib/i18n/` | How does the app pick the device language? | [Expo localization guide](https://docs.expo.dev/guides/localization/) |

## H. Testing

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **Jest** | `jest.config.js`, `*.test.ts(x)` | What's a mock? Why does `service.test.ts` mock `@/lib/api`? | [Jest mock functions](https://jestjs.io/docs/mock-functions) |
| **React Native Testing Library** | `product-form.test.tsx` | Why query by text/testID instead of component internals? `getBy` vs `queryBy` vs `findBy`? | [How should I query?](https://callstack.github.io/react-native-testing-library/docs/guides/how-to-query) · [Testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) |
| **Maestro** (E2E) | `.maestro/products/products-crud.yaml` | Read the flow. Add a step that edits a product and checks "Product updated" | [Maestro: first flow](https://docs.maestro.dev/getting-started/writing-your-first-flow) |

## I. Code quality & workflow

| Topic | Where | Research questions | Read |
|---|---|---|---|
| **ESLint** (@antfu config) | `eslint.config.mjs` | Why no Prettier? What does `pnpm lint:fix` fix automatically? | [Why I don't use Prettier](https://antfu.me/posts/why-not-prettier) |
| **Husky + lint-staged** | `.husky/`, `lint-staged.config.js` | What runs when you `git commit`? Why only staged files? | [Husky: get started](https://typicode.github.io/husky/get-started.html) |
| **commitlint / Conventional Commits** | `commitlint.config.js` | Write 5 example messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:` | [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) · [How to write a commit message](https://cbea.ms/git-commit/) |
| pnpm | `pnpm-lock.yaml` | Why pnpm over npm? What is a lockfile for? | [pnpm motivation](https://pnpm.io/motivation) |

## J. Environments, builds, release

| Topic | Where | Research questions | Read |
|---|---|---|---|
| Env vars | `env.ts`, `.env` | Why must app vars start with `EXPO_PUBLIC_`? Why are they **not secret**? | [Environment variables in Expo](https://docs.expo.dev/guides/environment-variables/) |
| App config | `app.config.ts` | Bundle ID / package name: why must they be unique per app? | [App config](https://docs.expo.dev/workflow/configuration/) · [Multiple app variants](https://docs.expo.dev/tutorial/eas/multiple-app-variants/) |
| **EAS Build / Submit** | `eas.json` | What's a build profile? What's the difference between development, preview and production? | [eas.json build profiles](https://docs.expo.dev/build/eas-json/) |
| **EAS Update** (OTA) | [12 · Environments & Builds](./12-environments-and-builds.md) | What can an OTA update change, and what can't it? What's a runtime version? | [EAS Update best practices](https://expo.dev/blog/eas-update-best-practices) · [Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/) |

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
