# 16 · Local Mock API (your own JSON backend)

DummyJSON *pretends* to save your changes. To practise CRUD for real, this repo ships a **tiny local backend** that saves every Create / Update / Delete into a JSON file you can open and watch.

```
App (simulator)  ──HTTP──▶  mock-api/server.js  ──reads/writes──▶  mock-api/db.json
```

- **Zero dependencies**: plain Node.js (`http` + `fs`), about 200 lines. Read [`mock-api/server.js`](../mock-api/server.js) top to bottom. It's a good first look at what a REST backend does.
- **Same response shape as DummyJSON**, so the app code doesn't change. Only `EXPO_PUBLIC_API_URL` in `.env` does. That's the payoff of the [4-layer architecture](./03-architecture.md).

## 16.1 Run it

Use two terminals:

```bash
# Terminal 1 — the backend
pnpm mock:api              # 🚀 Mock API on http://localhost:3001

# Terminal 2 — the app
pnpm start -c              # -c because .env is read at bundle time
```

`.env` already points at it:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001/
```

| Where the app runs | Use this URL |
|---|---|
| iOS simulator | `http://localhost:3001/` |
| Android emulator | `http://10.0.2.2:3001/` (the emulator's alias for your computer) |
| Physical phone (same Wi-Fi) | `http://<your-computer-LAN-IP>:3001/`, e.g. `http://192.168.1.20:3001/` |
| Back to the remote practice API | `https://dummyjson.com/` |

After changing `.env`, **always restart Metro with `-c`**.

## 16.2 Watch the JSON change

1. Open `mock-api/db.json` in VS Code, next to the simulator.
2. In the app: **Add** a product → a new object appears at the bottom of `"products"`, and the product shows at the **top** of the list (newest first).
3. **Edit** it → its fields change in the file.
4. **Delete** it → it disappears from the file and the list.
5. Terminal 1 logs every request: `POST /products/add → 201 (403ms)`.

Made a mess? Reset to the original 30 products and 20 posts:

```bash
pnpm mock:reset            # copies db.seed.json → db.json
```

`db.json` is git-ignored (your test data stays on your machine). `db.seed.json` is the committed starting data.

## 16.3 Routes

**Every top-level array in `db.json` is a resource.** Today that's `products` and `posts` (the Feed tab). Add `"orders": []`, restart the server, and you have an orders API.

| Action | Method | URL | Returns |
|---|---|---|---|
| List (paged) | GET | `/products?skip=0&limit=20` | `{ products, total, skip, limit }` |
| Search | GET | `/products/search?q=phone` | same shape, filtered |
| Read one | GET | `/products/5` | the item, or `404 { message }` |
| Create | POST | `/products/add` (or `/products`) | `201` + the new item with its `id` |
| Update | PUT / PATCH | `/products/5` | the merged item |
| Delete | DELETE | `/products/5` | the item + `isDeleted: true` |

Try it without the app:

```bash
curl http://localhost:3001/                                  # lists collections + routes
curl "http://localhost:3001/products?limit=2"
curl -X POST http://localhost:3001/products/add \
  -H 'content-type: application/json' \
  -d '{"title":"Test Phone","description":"From curl","category":"smartphones","price":99,"stock":5}'
```

## 16.4 Things built in on purpose (to learn from)

| Feature | Why it's there | Try this |
|---|---|---|
| **400 ms fake delay** | So you can see loading spinners and the disabled submit button | `MOCK_DELAY=3000 pnpm mock:api` to make loading states obvious |
| **Server-side validation** for products | The server must never trust the client. It returns `400 { message, errors }` | `curl -X POST .../products/add -d '{"title":"x"}' -H 'content-type: application/json'` |
| **404 for unknown ids** | Lets you test the error screen | Open a product, delete it in `db.json` by hand, pull to refresh |
| **Server owns the `id`** | Clients never choose ids | Send `"id": 999` in a POST, and it's ignored |
| **Stop the server** | Simulates "backend down / no network" | Ctrl-C in Terminal 1, then pull to refresh in the app → error + **Try again** |

## 16.5 Exercises

1. Add `"brand"` to a few products in `db.seed.json`, run `pnpm mock:reset`, then show it on the detail screen. Touch the type, the screen and the server's `EDITABLE_FIELDS`.
2. Add a `"categories"` collection and build a picker for the product form.
3. Add sorting: support `?sortBy=price&order=asc` in the server, then pass it from `productService.getAll`.
4. Make the server reject duplicate titles with `409 Conflict`, and show the server's message in the app's error toast. Hint: the axios interceptor already copies `message` into `error.message`.
5. Build a second feature (e.g. **Orders**) end to end using [13 · Adding a New Feature](./13-adding-a-new-feature.md) against this server.

> ⚠️ This is a **learning tool**, not a real backend: no auth, no concurrency safety, one JSON file. Production apps talk to a real API.
