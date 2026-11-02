# 1. Getting Started

← [Docs home](./README.md) · Next: [Project Structure](./02-project-structure.md) →

## 1.1 Install the tools (once)

| Tool | Why | Check |
|---|---|---|
| **Node.js LTS** (20+) | Runs the JS tooling | `node -v` |
| **pnpm** | Our package manager — **npm and yarn are blocked** by a `preinstall` script | `pnpm -v` |
| **Git** + GitHub SSH key | Code & PRs | `ssh -T git@github.com` |
| **VS Code** or Cursor | Editor — install the recommended extensions from `.vscode/extensions.json` when prompted | — |
| **Android Studio** | Android SDK + emulator | Create a Pixel emulator |
| **Xcode** (macOS only) | iOS simulator | Open once, accept license |
| **Watchman** (macOS/Linux) | Fast file watching | `watchman -v` |
| **JDK 17** | Android builds | `java -version` |

Follow Expo's official guide for your OS: **[Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/)** → choose *Development build*.

> No Mac? Develop on Android. Before merging UI work, ask a teammate with a Mac to check iOS, or install an EAS build.

## 1.2 Run the app

```bash
git clone <this-repo-url> my-app
cd my-app
pnpm install

pnpm android     # builds the native dev client + opens it on the emulator (first time: 5–15 min)
pnpm ios         # macOS only
```

After the first build you usually only need:

```bash
pnpm start       # starts Metro (the JS bundler). Press a = Android, i = iOS, j = debugger, r = reload
```

> 📌 We use a **development build** (`expo-dev-client`), **not Expo Go**. You only rebuild (`pnpm android` / `pnpm ios`) when native code changes — e.g. you installed a library with native code or changed `app.config.ts`. For normal JS/TS changes, Fast Refresh updates the app instantly.

### First run inside the app
1. Onboarding screen → tap **Let's Get Started**
2. Login screen → it's a **demo login**, any email + 6-char password works
3. Tabs: **Feed** (template example), **Products** (our CRUD reference), **Style** (UI kit demo), **Settings**

## 1.3 The `.env` file

The repo ships with a `.env` that points at the free practice API:

```bash
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_URL=https://dummyjson.com/
```

Change `.env`? Restart Metro with a clean cache: `pnpm start -c`. Full details in [Environments & Builds](./12-environments-and-builds.md).

## 1.4 Commands you'll use every day

| Command | What it does |
|---|---|
| `pnpm start` | Start Metro bundler |
| `pnpm start -c` | Start Metro and clear its cache (fixes "weird" issues) |
| `pnpm android` / `pnpm ios` | Build + install the dev client and run |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix code style |
| `pnpm type-check` | TypeScript check |
| `pnpm test` / `pnpm test:watch` | Run unit tests (once / on every save) |
| `pnpm check-all` | lint + type-check + translations lint + tests — **run before every PR** |
| `pnpm e2e-test` | Run Maestro end-to-end tests (needs Maestro + a running dev build) |
| `pnpm doctor` | Check Expo/dependency health |

The full list lives in `package.json` → `"scripts"`.

## 1.5 "It works" checklist (Day 1)

- [ ] App opens on an emulator/simulator or your phone
- [ ] You can open **Products**, scroll, search, open a product
- [ ] You changed a text and saw it update instantly
- [ ] `pnpm check-all` passes
- [ ] You created a branch and made a commit (Husky ran the checks)
