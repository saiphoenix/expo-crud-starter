import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { useCSSVariable, useUniwind } from 'uniwind';

function pick(value: string | number | undefined, fallback: string) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

/**
 * Navigation theme (headers, tab bar, screen background) built from the SAME
 * semantic tokens as the rest of the UI (`src/global.css`), so navigation and
 * screens always match in light and dark mode. Change colours in global.css only.
 */
export function useThemeConfig(): Theme {
  const { theme } = useUniwind();
  const [primary, background, card, text, border, notification] = useCSSVariable([
    '--color-primary',
    '--color-background',
    '--color-card',
    '--color-foreground',
    '--color-border',
    '--color-destructive',
  ]);

  return React.useMemo(() => {
    const base = theme === 'dark' ? _DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: pick(primary, base.colors.primary),
        background: pick(background, base.colors.background),
        card: pick(card, base.colors.card),
        text: pick(text, base.colors.text),
        border: pick(border, base.colors.border),
        notification: pick(notification, base.colors.notification),
      },
    };
  }, [theme, primary, background, card, text, border, notification]);
}
