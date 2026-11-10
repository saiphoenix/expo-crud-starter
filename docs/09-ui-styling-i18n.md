# 9. UI, Styling & Translations

← [State & Storage](./08-state-and-storage.md) · Next: [Testing](./10-testing.md) →

This page starts with the basics every mobile screen needs, then shows how our UI kit and theme put them into practice. Open the **Style** tab in the app while you read: it shows every component and colour token live.

## 9.1 The basics: how a mobile screen is laid out

| Basic | What to know | In this repo |
|---|---|---|
| **Units** | Sizes are in density-independent points (pt on iOS, dp on Android), not pixels. `16` looks the same size on every phone. | `p-4` = 16pt |
| **Flexbox** | Every `View` is a flex container. Default direction is **column** (top to bottom), unlike the web. | `flex-row`, `flex-1`, `items-center`, `justify-between` |
| **Spacing** | Use a 4pt grid: 4, 8, 12, 16, 24, 32. Consistent spacing makes screens look designed. | `p-1`=4 · `p-2`=8 · `p-3`=12 · `p-4`=16 · `p-6`=24 · `p-8`=32 |
| **Screen padding** | 16pt on the left and right is the usual default on phones. | `px-4` |
| **Safe areas** | Notches, the status bar and the home indicator cover parts of the screen. Content must stay inside the safe area. | Screens under a header or tab bar are already safe; full-screen screens use `SafeAreaView` (see `onboarding-screen.tsx`) |
| **Touch targets** | Anything tappable must be at least **44×44pt** (Apple) / **48×48dp** (Android). | `Button` is 44pt tall; small buttons get `hitSlop` |

## 9.2 Colour: use theme tokens, not raw colours

All colours come from **semantic tokens** in [`src/global.css`](../src/global.css). A token says *what a colour is for*, not what it looks like, and each token has a light and a dark value. When the user switches Light / Dark / System in Settings, every token switches with it. You don't need `dark:` classes.

| Token class | Use it for |
|---|---|
| `bg-background` · `text-foreground` | Screen background and normal text |
| `bg-card` · `text-card-foreground` | Cards, list rows, bottom sheets |
| `bg-muted` · `text-muted-foreground` | Subtle backgrounds, secondary text (captions, hints) |
| `border-border` · `border-input` | Dividers and card borders · input borders |
| `bg-primary` · `text-primary-foreground` | The main brand action (one per screen) |
| `bg-secondary` · `text-secondary-foreground` | Secondary actions |
| `bg-destructive` · `text-destructive` | Delete actions and error messages |
| `text-success` · `text-warning` | Status messages |

```tsx
// ✅ Works in light and dark mode automatically
<View className="rounded-xl border border-border bg-card p-3">
  <Text className="font-semibold">Title</Text>
  <Text className="text-sm text-muted-foreground">Subtitle</Text>
</View>

// ❌ Hard-coded colours: breaks in dark mode and when the brand changes
<View className="bg-white dark:bg-neutral-900">
```

- Every text/background pair in the theme meets the **WCAG AA contrast** ratio (4.5:1). Check new colours with a [contrast checker](https://webaim.org/resources/contrastchecker/).
- The raw palettes (`primary-500`, `neutral-200`, …) still exist for rare one-off cases. Reach for a token first.
- Need a token's value in JavaScript (e.g. an SVG or a third-party prop)? Use `useCSSVariable('--color-primary')` from `uniwind` (see `use-theme-config.tsx`).
- Changing the brand colour? Change it **once** in `global.css`, in both the `light` and `dark` blocks.

## 9.3 Typography

- All text uses our `Text` component, which applies the **Inter** font (`font-inter`) and `text-foreground`.
- Use one size scale across the app:

| Use | Classes |
|---|---|
| Screen title | `text-2xl font-bold` |
| Section title | `text-xl font-semibold` |
| Body (default) | `text-base` |
| Secondary / caption | `text-sm text-muted-foreground` |
| Tiny labels | `text-xs` |

- Don't turn off font scaling. Many users enlarge text in their phone settings. Test with the largest font size, and use `numberOfLines` where long text could break a layout.

## 9.4 The UI kit — `src/components/ui/`

Always build screens from these components instead of raw React Native ones.

| Component | Use for |
|---|---|
| `Text` | All text. Supports `className` and `tx="translation.key"` |
| `Button` | Variants: `default`, `primary` (brand), `secondary`, `outline`, `destructive`, `ghost`, `link`; sizes `sm`/`default`/`lg`/`icon`; `loading` prop |
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

Need a component used in 2+ features? Add it to `components/ui/` (with a test), not inside a feature. Build it with tokens, a pressed state, and an accessibility role from day one.

## 9.5 Styling with Uniwind

We style with Tailwind class names using [Uniwind](https://docs.uniwind.dev/theming/global-css) (Tailwind v4 for React Native).

- **Variants:** components use [`tailwind-variants`](https://www.tailwind-variants.org/docs/slots) (`tv(...)`). See `button.tsx` for the pattern.
- **Pressed state:** `active:opacity-80` on a `Pressable` gives tap feedback. Every tappable thing needs visible feedback.
- **Colour props that aren't styles** (spinner colour, placeholder colour) use the `accent-` prefix: `<ActivityIndicator colorClassName="accent-primary" />`, `<TextInput placeholderTextColorClassName="accent-muted-foreground" />`.
- **Platform differences:** `ios:` and `android:` prefixes, e.g. `ios:pt-2 android:pt-4`.
- Need a style that can't be a class (e.g. a computed width)? Use the `style` prop.

## 9.6 Platform conventions

Our app runs on iOS and Android. Respect what users of each platform expect:

- Android has a system **back button/gesture**. Every screen must work with it (Expo Router handles this for stacks).
- iOS users swipe from the left edge to go back. Don't put horizontal gestures near the left edge.
- Use the native `Alert` for confirmations (see delete in `product-detail-screen.tsx`). It looks right on both platforms.
- Check every UI PR on **both** platforms, in **light and dark** mode.

## 9.7 Accessibility basics

- Pressables get `accessibilityRole="button"` and an `accessibilityLabel` (see `product-card.tsx`; `Button` does this for you)
- Disabled and loading states are announced (`accessibilityState`, built into `Button`)
- Don't show errors by colour alone: show text (our `Input` and `Select` do, and screen readers announce them)
- Try the app once with TalkBack / VoiceOver and with the largest font size

## 9.8 Translations (i18n)

Files: `src/translations/en.json`, `src/translations/ar.json`. Setup: `src/lib/i18n/`.

**Rule: no hard-coded user-facing strings in features.**

```tsx
import { translate } from '@/lib/i18n';

<Text>{translate('products.error_loading')}</Text>
<Text tx="products.detail_title" />              // shortcut on our Text component
<Button label={translate('common.retry')} />
```

Keys are **type-checked** against `en.json`, so a typo is a TypeScript error.

Adding a string:
1. Add the key to `en.json` **and** `ar.json` (same structure, keys sorted)
2. Run `pnpm lint:translations`: it checks both files match and sorts keys
3. Use `translate('your.key')`

Arabic is right-to-left. When you switch to Arabic in Settings the app reloads in RTL. Check your layout still makes sense.

## 9.9 Formatting numbers & dates

Don't glue strings like `'$' + price`. Use `Intl`:

```ts
// src/features/products/utils.ts
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
```

## 9.10 Lists & performance

- Use `FlashList` (or `List` from the UI kit) for long lists. Never `.map()` inside a `ScrollView`
- `keyExtractor` returns the item's **id**, never the array index
- Wrap `renderItem` and handlers in `useCallback` (see `product-list-screen.tsx`)
- Debounce search inputs (`useDebounce` in `src/lib/hooks/`)

## 9.11 UI checklist for every PR

- [ ] Only theme tokens for colours (no `bg-white`, `text-black`, hex values)
- [ ] Spacing on the 4pt grid; 16pt screen padding
- [ ] Every tappable element ≥ 44pt, with pressed feedback and an accessibility label
- [ ] Loading, empty, error and success states all look right
- [ ] Checked in light **and** dark mode, on iOS **and** Android
- [ ] Checked with the largest font size
- [ ] No hard-coded strings; Arabic (RTL) still looks right

## 📖 Further reading

Read these in order. Each one explains one idea from this page.

**Layout and spacing**
- [Layout with Flexbox](https://reactnative.dev/docs/flexbox) (React Native): how Flexbox works on mobile, and how it differs from the web
- [The 8-Point Grid](https://spec.fm/specifics/8-pt-grid) (Elliot Dahl): why consistent spacing steps make UIs look designed
- [Grids & spacing](https://m3.material.io/foundations/layout/understanding-layout/spacing) (Material Design 3): margins, padding and touch-target spacing on Android
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) (Apple HIG): safe areas, margins and adapting to screen sizes on iOS
- [Safe areas](https://docs.expo.dev/develop/user-interface/safe-areas/) (Expo): the notch, the status bar and how to handle them

**Colour and theming**
- [Color roles](https://m3.material.io/styles/color/roles) (Material Design 3): the idea behind "background / surface / primary / on-primary" tokens
- [Theming](https://ui.shadcn.com/docs/theming) (shadcn/ui): the `background` / `foreground` token naming our theme follows
- [Design tokens](https://m3.material.io/foundations/design-tokens/overview) (Material Design 3): why components should use tokens instead of raw values
- [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) (Apple HIG): what changes in dark mode beyond swapping colours
- [Global CSS and theme variables](https://docs.uniwind.dev/theming/global-css) (Uniwind): how our light/dark tokens are defined
- [Building high-quality UIs with Expo and NativeWind](https://expo.dev/blog/building-high-quality-uis-with-expo-and-nativewind) (Expo blog): the same token approach in a sister library

**Typography**
- [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) (Apple HIG): type sizes, weights and Dynamic Type
- [Type scale](https://m3.material.io/styles/typography/type-scale-tokens) (Material Design 3): building a consistent size scale
- [Fonts](https://docs.expo.dev/develop/user-interface/fonts/) (Expo): how custom fonts like Inter are bundled

**Touch, buttons and components**
- [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) (Apple HIG): sizes, hit areas and button styles
- [Accessibility designing](https://m3.material.io/foundations/designing/structure) (Material Design 3): touch targets and focus order
- [Slots](https://www.tailwind-variants.org/docs/slots) (Tailwind Variants): the `tv()` slot pattern used in `button.tsx` and `input.tsx`

**Accessibility**
- [Accessibility](https://reactnative.dev/docs/accessibility) (React Native): roles, labels, states and live regions
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) (Apple HIG): contrast, text size and VoiceOver

**Translations and formatting**
- [Localization](https://docs.expo.dev/guides/localization/) (Expo): getting the device language and supporting RTL
- [Plurals](https://www.i18next.com/translation-function/plurals) (i18next): "1 item" vs "2 items" done right
- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) (MDN): currency and number formatting

**Lists and performance**
- [FlashList performance](https://shopify.github.io/flash-list/docs/fundamentals/performance) (Shopify): what makes list items fast
- [Fix the slow render before you fix the re-render](https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render) (Kent C. Dodds): where to look first when a screen is slow
