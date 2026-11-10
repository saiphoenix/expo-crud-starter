# 2. Project Structure

← [Getting Started](./01-getting-started.md) · Next: [Architecture](./03-architecture.md) →

We use a **feature-based** structure: everything about one feature lives in one folder. When you work on Products you only touch `src/features/products/` (plus a one-line route file).

## 2.1 Root folder

```
.
├── src/                    # 👈 all app code (see below)
├── docs/                   # 📚 you are here
├── assets/                 # app icon, splash, fonts, images
├── .maestro/               # end-to-end (E2E) tests
├── .github/workflows/      # CI: lint, type-check, tests, EAS builds
├── .husky/                 # git hooks (run checks on commit)
├── __mocks__/              # Jest mocks for native modules
├── cli/                    # template setup scripts (you rarely touch this)
├── scripts/                # helper scripts
├── app.config.ts           # Expo app config (name, icons, plugins, permissions)
├── env.ts                  # ✅ environment variables: schema + per-env values
├── .env                    # local env values (never put real secrets here)
├── eas.json                # EAS Build profiles (development / preview / production)
├── eslint.config.mjs       # lint rules
├── jest.config.js          # test config
├── tsconfig.json           # TypeScript config + the `@/` path alias
├── claude.md               # notes for AI coding assistants
└── package.json            # dependencies + scripts
```

## 2.2 The `src/` folder

```
src/
├── app/                                  # 🧭 ROUTES ONLY (Expo Router) — one-line files
│   ├── _layout.tsx                       # Root: providers (theme, React Query, keyboard, toasts)
│   ├── login.tsx                         # /login
│   ├── onboarding.tsx                    # /onboarding
│   ├── (app)/                            # logged-in area with bottom tabs
│   │   ├── _layout.tsx                   # tabs + AUTH GUARD (redirects to /login)
│   │   ├── index.tsx                     # / → Feed tab
│   │   ├── products.tsx                  # /products → Products tab (list)
│   │   ├── style.tsx                     # /style
│   │   └── settings.tsx                  # /settings
│   ├── product/                          # product screens pushed ON TOP of the tabs
│   │   ├── add.tsx                       # /product/add
│   │   └── [id]/
│   │       ├── index.tsx                 # /product/5
│   │       └── edit.tsx                  # /product/5/edit
│   └── feed/                             # template example (posts)
│
├── features/                             # 🧩 BUSINESS LOGIC, one folder per feature
│   ├── products/                         # ⭐ REFERENCE CRUD FEATURE
│   │   ├── types.ts                      # data shapes (Product, ProductInput…)
│   │   ├── service.ts                    # Layer 2: API calls (axios via client)
│   │   ├── query-keys.ts                 # cache key factory
│   │   ├── api.ts                        # Layer 3: React Query hooks
│   │   ├── schema.ts                     # Zod validation + form↔API converters
│   │   ├── utils.ts                      # small helpers (formatPrice)
│   │   ├── product-list-screen.tsx       # Layer 4: screens
│   │   ├── product-detail-screen.tsx
│   │   ├── product-create-screen.tsx
│   │   ├── product-edit-screen.tsx
│   │   ├── components/
│   │   │   ├── product-card.tsx
│   │   │   └── product-form.tsx          # shared by create + edit
│   │   └── *.test.ts(x)                  # tests live next to the code they test
│   ├── auth/                             # login screen + auth store (Zustand)
│   ├── feed/                             # template example using react-query-kit
│   ├── onboarding/
│   ├── settings/
│   └── style-demo/                       # showcases the UI kit
│
├── components/ui/                        # 🎨 design system: Button, Input, Text, Modal, Select, List…
├── lib/                                  # 🔧 infrastructure (no business logic)
│   ├── api/
│   │   ├── client.tsx                    # Layer 1: the ONE axios instance + interceptors
│   │   ├── provider.tsx                  # QueryClient + provider
│   │   └── utils.tsx                     # pagination helpers
│   ├── auth/utils.tsx                    # get/set/remove token (MMKV)
│   ├── hooks/                            # shared hooks (useDebounce, useIsFirstTime, useSelectedTheme)
│   ├── i18n/                             # translation setup + translate()
│   ├── storage.tsx                       # MMKV wrapper (getItem/setItem/removeItem)
│   ├── test-utils.tsx                    # custom render/setup for tests
│   └── utils.ts                          # createSelectors (Zustand), openLinkInBrowser
├── translations/                         # 🌐 en.json, ar.json
└── global.css                            # Tailwind theme (colors, fonts)
```

## 2.3 What goes where — ask 3 questions

| Question | Put it in |
|---|---|
| Is it a **URL / screen address**? | `src/app/` — a one-line re-export, nothing else |
| Is it used by **one feature** only? | `src/features/<feature>/` |
| Is it used by **2+ features** and has no business logic? | `src/components/ui/` (UI) or `src/lib/` (non-UI) |

## 2.4 Naming rules

| Thing | Rule | Example |
|---|---|---|
| Files & folders | `kebab-case` (enforced by ESLint) | `product-card.tsx` |
| Components | `PascalCase` | `ProductCard` |
| Screens | end with `-screen.tsx`, export `XxxScreen` | `product-list-screen.tsx` → `ProductListScreen` |
| Hooks / stores | start with `use-` / `use` | `use-auth-store.tsx` → `useAuthStore` |
| Tests | next to the file, `.test.ts(x)` | `product-card.test.tsx` |
| Route files | match the URL | `app/product/[id]/edit.tsx` |

## 2.5 Import rules

```ts
// ✅ Inside the same feature → relative
import { useProducts } from './api';
import { ProductCard } from './components/product-card';

// ✅ Everything else → the `@/` alias (points to src/)
import { Button, Input } from '@/components/ui';
import { client } from '@/lib/api';
import { translate } from '@/lib/i18n';

// ✅ Env config
import Env from 'env';

// ❌ Don't import another feature's internals (e.g. products importing feed/components).
//    If two features need it, move it to components/ui or lib.
// ❌ Don't create new index.ts "barrel" files inside features — import the exact file.
```

## 📖 Further reading

- [React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/) (Robin Wieruch): how a codebase grows from flat files to feature folders
- [Project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) (Bulletproof React): the feature-folder layout and import rules we follow
- [Colocation](https://kentcdodds.com/blog/colocation) (Kent C. Dodds): keep code next to where it is used
- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) (Robert C. Martin): why folders should be named after features, not file types
- [Core concepts of file-based routing](https://docs.expo.dev/router/basics/core-concepts/) (Expo): why `src/app/` files are routes
