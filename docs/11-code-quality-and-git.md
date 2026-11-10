# 11. Code Quality & Git Workflow

← [Testing](./10-testing.md) · Next: [Environments & Builds](./12-environments-and-builds.md) →

## 11.1 The tools (they run automatically)

| Tool | Think of it as | Catches |
|---|---|---|
| **TypeScript** (`strict`) | Spell-checker for data | `product.titel`, string passed where number expected |
| **ESLint** (`@antfu/eslint-config` + plugins) | Robot reviewer **and** formatter | unused vars, import order, hooks rules, Tailwind class typos, file names not kebab-case |
| **eslint-plugin-i18n-json** | Translation checker | `en.json`/`ar.json` out of sync or unsorted |
| **Husky** | Guard at the git door | runs checks on commit |
| **lint-staged** | Guard's checklist | ESLint `--fix` on only the files you changed |
| **commitlint** | Message checker | enforces Conventional Commits |
| **GitHub Actions** | Second guard on the server | lint, type-check, tests on every PR (`.github/workflows/`) |

> There's no separate Prettier — ESLint Stylistic formats the code (`pnpm lint:fix`). Enable "fix on save" in VS Code (the repo's `.vscode/settings.json` does this).

## 11.2 What happens when you commit

```
git commit -m "feat(products): add edit screen"
      │
      ▼  .husky/pre-commit
      ├── ❌ blocked if you're on main/master  (create a branch!)
      ├── pnpm type-check
      └── lint-staged → eslint --fix on changed files
      ▼  .husky/commit-msg
      └── commitlint → is the message "type: description"?
All pass → ✅ committed      Any fail → ❌ read the error, fix, commit again
```

> ❌ Never use `git commit --no-verify`. CI runs the same checks and will fail anyway.

## 11.3 Commit messages (Conventional Commits)

```
feat(products): add product edit screen
fix(products): prevent duplicate items on infinite scroll
refactor: move price formatter to utils
test(products): add schema tests
docs: explain query keys
chore: update dependencies
```

Format: `type(optional-scope): short description in lowercase`.

## 11.4 Git workflow

```
main  ──●──────────────●──────────────●──▶   protected, always working
         \            /
          ●──●──●────●   feat/products-edit  → Pull Request → review → merge
```

```bash
git checkout main && git pull                 # start from latest
git checkout -b feat/products-edit            # one branch per task
# … code …
pnpm check-all                                # lint + types + translations + tests
git status                                    # see what changed
git add src/features/products docs/           # add specific paths
git commit -m "feat(products): add edit screen"
git push -u origin feat/products-edit
# open a Pull Request on GitHub
```

Branch names: `feat/…`, `fix/…`, `chore/…`, `docs/…`.

## 11.5 Pull Request checklist

Before asking for review:

- [ ] I read my own diff on GitHub top to bottom
- [ ] `pnpm check-all` passes
- [ ] No `console.log`, commented-out code, `any`, `@ts-ignore`
- [ ] No secrets or real `.env` values
- [ ] All 4 UI states handled (loading / error / empty / success); tried airplane mode
- [ ] Tested on Android **and** iOS; dark mode; Arabic (RTL) if UI changed
- [ ] New strings are in `en.json` and `ar.json`
- [ ] Small PR, one task (aim for < 300 changed lines)

PR description template:

```md
## What
Adds the product edit screen.

## Why
Products CRUD — Update.

## How to test
1. Products → tap a product → Edit
2. Clear the title → error shows
3. Change price → Save → detail shows the new price, toast appears

## Screenshots / video
| Android | iOS |
|---|---|
|  |  |
```

## 📖 Further reading

- [How to Write a Git Commit Message](https://cbea.ms/git-commit/) (Chris Beams): the seven rules of a good commit message
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) (Conventional Commits): the `feat:` / `fix:` format commitlint checks
- [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) (Google): why small PRs get reviewed faster and break less
- [Writing good CL descriptions](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) (Google): what to put in your PR description
- [The standard of code review](https://google.github.io/eng-practices/review/reviewer/standard.html) (Google): what reviewers look for
- [Why I don't use Prettier](https://antfu.me/posts/why-not-prettier) (Anthony Fu): why this repo formats with ESLint only
