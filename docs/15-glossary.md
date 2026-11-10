# 15. Glossary

← [Debugging & Common Mistakes](./14-debugging-and-common-mistakes.md) · [Docs home](./README.md)

| Term | Meaning |
|---|---|
| **API** | The server's menu of URLs the app can call |
| **Endpoint** | One URL on the API, e.g. `/products/5` |
| **JSON** | Text format for data: `{ "id": 5, "title": "Shoes" }` |
| **HTTP method** | The action: GET (read), POST (create), PUT/PATCH (update), DELETE |
| **Status code** | 200 OK · 201 created · 400 bad request · 401 not logged in · 403 forbidden · 404 not found · 500 server error |
| **Token** | A pass proving you're logged in, sent in the `Authorization` header |
| **Client** | Our single axios instance (`src/lib/api/client.tsx`) |
| **Interceptor** | Code that runs on every request/response automatically |
| **Service** | Plain functions that call endpoints (`service.ts`) |
| **Query** | Reading server data with React Query |
| **Mutation** | Changing server data (create/update/delete) |
| **Query key** | The name React Query stores cached data under |
| **Cache** | Saved copy of data in memory |
| **Stale** | Cached data that might be outdated |
| **Invalidate** | Mark cached data outdated → refetch |
| **Infinite query** | A list that loads more pages as you scroll |
| **Debounce** | Wait until the user stops typing before acting |
| **Schema** | Validation rules (Zod) |
| **Hook** | A React function starting with `use…` |
| **Props** | Inputs passed to a component |
| **State** | Data that re-renders the UI when it changes |
| **Store** | Global state container (Zustand) |
| **MMKV** | Fast on-device key-value storage |
| **Route** | A screen's address (file path in `src/app/`) |
| **Layout** | `_layout.tsx` — wraps all screens in a folder (stack/tabs/guard) |
| **Group** | `(folder)` — shares a layout, not part of the URL |
| **Dynamic route** | `[id].tsx` — a URL segment that changes |
| **Auth guard** | Code that redirects signed-out users to login |
| **Metro** | The bundler that serves JS to the app in development |
| **Fast Refresh** | Instantly applying code changes without restarting |
| **Dev client / development build** | Our own debug build of the app (instead of Expo Go) |
| **Native module** | Kotlin/Swift code; adding one needs a new build |
| **Prebuild** | Generating the `android/` and `ios/` folders from `app.config.ts` |
| **EAS** | Expo Application Services — cloud builds, submissions, updates |
| **OTA update** | Shipping JS changes to users without a store release |
| **Bundle ID / package** | The app's unique id on iOS / Android |
| **i18n** | Internationalisation — translations |
| **RTL** | Right-to-left languages like Arabic |
| **CI** | Automated checks on every PR (GitHub Actions) |
| **PR** | Pull Request — asking the team to review and merge your branch |
| **Conventional Commits** | Commit message format: `type(scope): description` |

## 📖 Further reading

- [About the New Architecture](https://reactnative.dev/architecture/landing-page) (React Native): Fabric, TurboModules and JSI in plain words
- [Expo Go vs Development Builds](https://expo.dev/blog/expo-go-vs-development-builds) (Expo blog): two terms new mobile developers mix up most
