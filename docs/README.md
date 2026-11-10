# 📚 Project Documentation

Welcome! This folder explains **everything** about how this React Native app is built — so you can start contributing without guessing.

This repo is our **team starter template**. It is based on the [Obytes React Native Template](https://github.com/obytes/react-native-template-obytes) and adds a complete, production-style **Products CRUD** feature (`src/features/products/`) as the reference for how we build every feature.

> 🧭 **Golden rule:** when you're unsure how to do something, open `src/features/products/` and copy the pattern.

## Reading order

Read these in order during your first week. Each one is short.

| # | Doc | You'll learn |
|---|---|---|
| 1 | [Getting Started](./01-getting-started.md) | Install tools, run the app, the daily commands |
| 2 | [Project Structure](./02-project-structure.md) | What every folder and file is for, naming + import rules |
| 3 | [Architecture & Data Flow](./03-architecture.md) | The 4 layers: Screen → Hook → Service → Client |
| 4 | [API Layer](./04-api-layer.md) | Axios client, interceptors, service functions, env vars |
| 5 | [React Query](./05-react-query.md) | Queries, mutations, query keys, caching, invalidation |
| 6 | [Routing & Navigation](./06-routing-navigation.md) | Expo Router, tabs, stacks, dynamic routes, auth guard |
| 7 | [Forms & Validation](./07-forms-and-validation.md) | TanStack Form + Zod, the reusable form pattern |
| 8 | [State & Storage](./08-state-and-storage.md) | Where each kind of data lives (React Query, Zustand, MMKV) |
| 9 | [UI, Styling & i18n](./09-ui-styling-i18n.md) | `components/ui`, Tailwind via Uniwind, dark mode, translations |
| 10 | [Testing](./10-testing.md) | Jest unit tests, component tests, Maestro E2E |
| 11 | [Code Quality & Git](./11-code-quality-and-git.md) | ESLint, TypeScript, Husky, commit messages, PRs |
| 12 | [Environments & Builds](./12-environments-and-builds.md) | dev/preview/production, EAS Build, OTA updates |
| 13 | [Recipe: Adding a New Feature](./13-adding-a-new-feature.md) | Step-by-step checklist to build any CRUD feature |
| 14 | [Debugging & Common Mistakes](./14-debugging-and-common-mistakes.md) | How to fix things fast, what not to do |
| 15 | [Glossary](./15-glossary.md) | Every term in plain English |
| 16 | [Local Mock API](./16-mock-api.md) | Run a local JSON backend so Create/Update/Delete really save |
| 17 | [Research & Explore Guide](./17-research-and-explore.md) | Every library in the repo: where it's used, what to research, docs links |

## The one diagram to remember

```
 ┌──────────────────────────────────────────────────────────────┐
 │ 4. SCREEN    product-list-screen.tsx                         │  shows UI, handles loading/error/empty
 └───────────────┬──────────────────────────────────────────────┘
                 │ calls hook
 ┌───────────────▼──────────────────────────────────────────────┐
 │ 3. HOOK      api.ts → useProducts()                          │  React Query: cache, refetch, state
 └───────────────┬──────────────────────────────────────────────┘
                 │ calls service
 ┌───────────────▼──────────────────────────────────────────────┐
 │ 2. SERVICE   service.ts → productService.getAll()            │  knows URLs + request/response shape
 └───────────────┬──────────────────────────────────────────────┘
                 │ uses client
 ┌───────────────▼──────────────────────────────────────────────┐
 │ 1. CLIENT    src/lib/api/client.tsx                          │  base URL, token, global errors
 └───────────────┬──────────────────────────────────────────────┘
                 ▼
              SERVER (local mock API → mock-api/db.json)
```

## Where to find the reference code

| Want to see… | Open |
|---|---|
| A full CRUD feature | `src/features/products/` |
| The HTTP client + interceptors | `src/lib/api/client.tsx` |
| A form with validation | `src/features/products/components/product-form.tsx` |
| A global store (Zustand) | `src/features/auth/use-auth-store.tsx` |
| Route files | `src/app/` |
| Unit tests | `src/features/products/*.test.ts(x)` |
| An E2E test | `.maestro/products/products-crud.yaml` |

## Further reading

Every guide ends with a **📖 Further reading** list: specific articles for the ideas on that page, not just library home pages. If you only have time for five, start with these:

1. [Practical React Query](https://tkdodo.eu/blog/practical-react-query) (TkDodo): how our data layer thinks
2. [Expo Go vs Development Builds](https://expo.dev/blog/expo-go-vs-development-builds) (Expo blog): why this app needs a dev build
3. [Thinking in React](https://react.dev/learn/thinking-in-react) (React): turning a design into components
4. [Color roles](https://m3.material.io/styles/color/roles) (Material Design 3): the idea behind our theme tokens (see [doc 09](./09-ui-styling-i18n.md))
5. [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests) (Kent C. Dodds): what to test

For every library in the repo, see [17 · Research & Explore](./17-research-and-explore.md). Practice APIs: [16 · Mock API](./16-mock-api.md) (local, default) or [DummyJSON](https://dummyjson.com/docs) (remote).
