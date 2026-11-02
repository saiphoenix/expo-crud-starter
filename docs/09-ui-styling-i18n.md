# 9. UI, Styling & Translations

← [State & Storage](./08-state-and-storage.md) · Next: [Testing](./10-testing.md) →

## 9.1 The UI kit — `src/components/ui/`

Always build screens from these components instead of raw React Native ones. Open the **Style** tab in the app to see them live.

| Component | Use for |
|---|---|
| `Text` | All text. Supports `className` and `tx="translation.key"` |
| `Button` | Variants: `default`, `secondary`, `outline`, `destructive`, `ghost`, `link`; sizes `sm`/`default`/`lg`; `loading` prop |
| `Input` | Text fields with `label` + `error` |
| `Select`, `Checkbox` | Pickers and toggles |
| `Modal` | Bottom-sheet modals (`@gorhom/bottom-sheet`) |
| `Image` | Remote/local images (`expo-image`, cached, with placeholder) |
| `List`, `EmptyList` | FlashList + the "no data / loading" placeholder |
| `FocusAwareStatusBar` | Correct status bar colour per screen |
| `showErrorMessage(msg)` | Red toast (`react-native-flash-message`) |
| `View`, `Pressable`, `ScrollView`, `ActivityIndicator`, `SafeAreaView` | Re-exported RN primitives |

```tsx
import { Button, Input, Text, View } from '@/components/ui';
```

Need a component used in 2+ features? Add it to `components/ui/` (with a test), not inside a feature.

## 9.2 Styling — Tailwind classes via Uniwind

We style with Tailwind CSS class names using [Uniwind](https://uniwind.dev) (Tailwind v4 for React Native).

```tsx
<View className="mx-4 my-2 flex-row rounded-xl border border-neutral-200 bg-white p-3 dark:bg-neutral-900">
  <Text className="font-semibold">Title</Text>
</View>
```

- Theme colours and fonts are defined in [`src/global.css`](../src/global.css) under `@theme` (e.g. `primary-*`, `neutral-*`, `charcoal-*`, `danger-*`). Add brand colours there — don't hard-code hex values in components.
- **Dark mode:** add `dark:` variants. Users switch Light/Dark/System in Settings.
- **Variants:** components use [`tailwind-variants`](https://www.tailwind-variants.org) (`tv(...)`) — see `button.tsx` for the pattern.
- Need a style that can't be a class (e.g. computed width)? Use the `style` prop.

## 9.3 Translations (i18n)

Files: `src/translations/en.json`, `src/translations/ar.json`. Setup: `src/lib/i18n/`.

**Rule: no hard-coded user-facing strings in features.**

```tsx
import { translate } from '@/lib/i18n';

<Text>{translate('products.error_loading')}</Text>
<Text tx="products.detail_title" />              // shortcut on our Text component
<Button label={translate('common.retry')} />
```

Keys are **type-checked** against `en.json` — a typo is a TypeScript error.

Adding a string:
1. Add the key to `en.json` **and** `ar.json` (same structure, keys sorted)
2. Run `pnpm lint:translations` — it checks both files match and sorts keys
3. Use `translate('your.key')`

Arabic is right-to-left. When you switch to Arabic in Settings the app reloads in RTL — check your layout still makes sense.

## 9.4 Formatting numbers & dates

Don't glue strings like `'$' + price`. Use `Intl`:

```ts
// src/features/products/utils.ts
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
```

## 9.5 Accessibility basics

- Pressables get `accessibilityRole="button"` and an `accessibilityLabel` (see `product-card.tsx`)
- Touch targets ≥ 44×44 pt
- Don't show errors by colour alone — show text
- Try the app once with TalkBack / VoiceOver and with the largest font size

## 9.6 Lists & performance

- Use `FlashList` (or `List` from the UI kit) for long lists — never `.map()` inside a `ScrollView`
- `keyExtractor` returns the item's **id**, never the array index
- Wrap `renderItem` and handlers in `useCallback` (see `product-list-screen.tsx`)
- Debounce search inputs (`useDebounce` in `src/lib/hooks/`)
