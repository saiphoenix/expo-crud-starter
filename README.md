<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="110px" style="border-radius:10px"/><br/>
  Expo CRUD Starter
</h1>

<p align="center">
Our team's React Native starter template — Expo + TypeScript + Expo Router + React Query + Zustand + TanStack Form, with a complete <b>Products CRUD</b> feature as the reference for how we build everything.
</p>

> Based on the [Obytes React Native Template](https://github.com/obytes/react-native-template-obytes) (MIT).

---

## 🖥️ First time? Set up your computer first

This app uses **native modules** (MMKV, Reanimated, keyboard-controller…) that are **not in Expo Go**, so you must build it yourself with Android Studio. If you've never done that, follow the step-by-step PDF for your computer **before** the quick start:

| Your computer | Guide |
|---|---|
| 🪟 **Windows** | [docs/android-setup-guide-windows.pdf](./docs/android-setup-guide-windows.pdf) |
| 🍎 **macOS** | [docs/android-setup-guide-mac.pdf](./docs/android-setup-guide-mac.pdf) |

The guides cover installing the tools, Android Studio and the SDK Manager (what to tick), environment variables, creating an emulator, ADB (emulators and real phones), running the app, and troubleshooting.

> No Expo account is needed to run the app locally.

## 🚀 Quick start

```bash
git clone https://github.com/saiphoenix/expo-crud-starter.git
cd expo-crud-starter
pnpm install
pnpm mock:api       # terminal 1 — local JSON backend (keep running)
pnpm android        # terminal 2 — or: pnpm ios (macOS only)
```

> **Android emulator:** set `EXPO_PUBLIC_API_URL=http://10.0.2.2:3001/` in `.env` (the emulator can't reach `localhost`). See [docs/16 · Mock API](./docs/16-mock-api.md).

Then: Onboarding → Login (any email + 6-char password) → **Products** tab.

New here? **Start with [`docs/README.md`](./docs/README.md)** and read docs 1–5 on your first day.

## 📚 Documentation

| | |
|---|---|
| [Setup PDF: Windows](./docs/android-setup-guide-windows.pdf) · [macOS](./docs/android-setup-guide-mac.pdf) | Beginner machine setup: Android Studio, emulator, ADB, first run |
| [Getting Started](./docs/01-getting-started.md) | Install, run, daily commands |
| [Project Structure](./docs/02-project-structure.md) | Every folder explained, naming + import rules |
| [Architecture & Data Flow](./docs/03-architecture.md) | Screen → Hook → Service → Client |
| [API Layer](./docs/04-api-layer.md) | Axios client, interceptors, services, env vars |
| [React Query](./docs/05-react-query.md) | Queries, mutations, keys, caching |
| [Routing & Navigation](./docs/06-routing-navigation.md) | Expo Router, tabs, auth guard |
| [Forms & Validation](./docs/07-forms-and-validation.md) | TanStack Form + Zod |
| [State & Storage](./docs/08-state-and-storage.md) | React Query vs Zustand vs MMKV |
| [UI, Styling & i18n](./docs/09-ui-styling-i18n.md) | UI basics, theme tokens & dark mode, accessibility, translations |
| [Testing](./docs/10-testing.md) | Jest, Testing Library, Maestro |
| [Code Quality & Git](./docs/11-code-quality-and-git.md) | Lint, Husky, commits, PRs |
| [Environments & Builds](./docs/12-environments-and-builds.md) | dev / preview / prod, EAS, OTA, new-project setup |
| [Adding a New Feature](./docs/13-adding-a-new-feature.md) | Step-by-step recipe |
| [Debugging & Common Mistakes](./docs/14-debugging-and-common-mistakes.md) | Fix things fast |
| [Glossary](./docs/15-glossary.md) | Every term in plain English |

## 🧩 The reference feature: Products

```
src/features/products/
├── types.ts                  # data shapes
├── service.ts                # API calls (Layer 2)
├── query-keys.ts             # cache keys
├── api.ts                    # React Query hooks (Layer 3)
├── schema.ts                 # Zod validation + converters
├── product-list-screen.tsx   # list + search + infinite scroll + pull-to-refresh
├── product-detail-screen.tsx # detail + delete
├── product-create-screen.tsx # create
├── product-edit-screen.tsx   # update
└── components/               # product-card, product-form (shared by create + edit)
```

Backend for practice: a **local mock API** (`mock-api/`) that saves every create/update/delete into `mock-api/db.json`:

```bash
pnpm mock:api      # terminal 1 — http://localhost:3001
pnpm start -c      # terminal 2 — the app
```

See [docs/16 · Mock API](./docs/16-mock-api.md). New here? Read [docs/17 · Research & Explore](./docs/17-research-and-explore.md) for every library used and what to study.

## 🛠 Stack

Expo SDK 54 · React Native 0.81 · React 19 · TypeScript · Expo Router 6 · TanStack Query 5 · Axios · Zustand · MMKV · TanStack Form + Zod · Uniwind (Tailwind v4) · i18next · FlashList · Jest + Testing Library · Maestro · ESLint · Husky · commitlint · EAS

## ✅ Before every PR

```bash
pnpm check-all     # lint + type-check + translations + tests
```

## Starting a new app from this template?

See the checklist in [Environments & Builds → Starting a new project](./docs/12-environments-and-builds.md#125-starting-a-new-project-from-this-template) (bundle IDs, EAS project, app name, API URL).
