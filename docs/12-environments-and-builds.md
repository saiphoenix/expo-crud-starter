# 12. Environments & Builds

← [Code Quality & Git](./11-code-quality-and-git.md) · Next: [Adding a New Feature](./13-adding-a-new-feature.md) →

## 12.1 Three environments

| Env | `EXPO_PUBLIC_APP_ENV` | Bundle ID (from `env.ts`) | Used for |
|---|---|---|---|
| development | `development` | `com.obytes.development` | Your machine |
| preview | `preview` | `com.obytes.preview` | QA / internal testers |
| production | `production` | `com.obytes` | App Store / Play Store |

Each environment has a **different bundle ID**, so all three apps can be installed side by side. Non-production app icons get a badge with the env name + version.

Run against an environment locally:

```bash
pnpm start:preview      pnpm android:preview      pnpm ios:preview
pnpm start:production   pnpm android:production   pnpm ios:production
```

## 12.2 How env vars flow

```
.env  ──▶  env.ts (Zod schema + per-env values)  ──▶  import Env from 'env'  (app code)
                                                 └──▶  app.config.ts          (name, bundle id, scheme…)
```

- `EXPO_PUBLIC_*` → available in the app (**public! no secrets**)
- No prefix (e.g. `APP_BUILD_ONLY_VAR`) → only in `app.config.ts` at build time
- For EAS cloud builds, set values with [EAS environment variables](https://docs.expo.dev/eas/environment-variables/) (`eas env:create`), not by committing `.env`

## 12.3 EAS Build (cloud builds)

Profiles live in [`eas.json`](../eas.json):

| Profile | Output | Command |
|---|---|---|
| `development` | Dev client for your team (internal) | `pnpm build:development:android` / `:ios` |
| `simulator` | iOS simulator build | `eas build --profile simulator --platform ios` |
| `preview` | APK / store build for testers | `pnpm build:preview:android` / `:ios` |
| `production` | Store build (AAB / IPA) | `pnpm build:production:android` / `:ios` |

## 12.4 OTA updates (EAS Update)

Each build profile has a `channel`. You can push **JavaScript-only** changes to a channel without a store release.

- ✅ OTA OK: bug fixes in TS/JS, styles, translations, images in JS
- ❌ Needs a new build: new native library, permissions, app icon/splash, `app.config.ts` changes, Expo SDK upgrade

> Freshers don't trigger preview/production builds or OTA updates — the lead or CI does (`.github/workflows/eas-build-*.yml`).

## 12.5 Starting a NEW project from this template

Do these once, right after cloning for a new client/app:

- [ ] `package.json` → `name`, `version` (start at `1.0.0`), `repository`
- [ ] `env.ts` → `NAME`, `BUNDLE_IDS`, `PACKAGES`, `SCHEMES` (use your company's reverse domain, e.g. `com.yourco.appname`)
- [ ] `app.config.ts` → `EXPO_ACCOUNT_OWNER`, `slug`, and `EAS_PROJECT_ID` (run `eas init` to create a new EAS project and get the id)
- [ ] `.env` → `EXPO_PUBLIC_API_URL` = your backend
- [ ] `assets/` → icon, adaptive icon, splash, favicon
- [ ] `src/global.css` → brand colours
- [ ] Delete the example features you don't need (`feed`, `style-demo`) + their routes
- [ ] Keep `features/products` until the team has built their first real feature, then delete it
- [ ] Update the root `README.md` (project name, backend URL, who to ask)
