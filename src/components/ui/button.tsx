import type { PressableProps, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { tv } from 'tailwind-variants';

/**
 * Button — colours come from the semantic tokens in `src/global.css`
 * (bg-primary, text-primary-foreground, …), so light and dark mode work
 * without `dark:` classes.
 *
 * Standards built in:
 * - Minimum touch target 44pt (Apple HIG) — `sm` keeps a small look but gets hitSlop
 * - Pressed feedback with `active:opacity-80`
 * - Screen readers hear "button", plus "disabled" / "busy" when relevant
 */
const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4 active:opacity-80',
    label: 'font-inter text-base font-semibold',
    // `accent-*` classes set the spinner's colour prop (Uniwind convention)
    indicator: 'accent-background',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-foreground',
        label: 'text-background',
        indicator: 'accent-background',
      },
      primary: {
        container: 'bg-primary',
        label: 'text-primary-foreground',
        indicator: 'accent-primary-foreground',
      },
      secondary: {
        container: 'bg-secondary',
        label: 'text-secondary-foreground',
        indicator: 'accent-secondary-foreground',
      },
      outline: {
        container: 'border bg-transparent border-border',
        label: 'text-foreground',
        indicator: 'accent-foreground',
      },
      destructive: {
        container: 'bg-destructive',
        label: 'text-destructive-foreground',
        indicator: 'accent-destructive-foreground',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'underline text-foreground',
        indicator: 'accent-foreground',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-primary',
        indicator: 'accent-primary',
      },
    },
    size: {
      default: {
        container: 'h-11 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-9 px-3',
        label: 'text-sm',
      },
      icon: { container: 'size-11' },
    },
    disabled: {
      true: {
        container: 'bg-muted',
        label: 'text-muted-foreground',
        indicator: 'accent-muted-foreground',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

// Extra touch area for the small button so it still meets the 44pt minimum.
const SMALL_HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

type ButtonVariants = VariantProps<typeof button>;
type Props = {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
} & ButtonVariants & Omit<PressableProps, 'disabled'>;

export function Button({ ref, label: text, loading = false, variant = 'default', disabled = false, size = 'default', className = '', testID, textClassName = '', ...props }: Props & { ref?: React.RefObject<View | null> }) {
  const styles = React.useMemo(
    () => button({ variant, disabled, size }),
    [variant, disabled, size],
  );
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      disabled={isDisabled}
      className={styles.container({ className })}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      hitSlop={size === 'sm' ? SMALL_HIT_SLOP : undefined}
      {...props}
      ref={ref}
      testID={testID}
    >
      {props.children
        ? (
            props.children
          )
        : (
            <>
              {loading
                ? (
                    <ActivityIndicator
                      size="small"
                      colorClassName={styles.indicator()}
                      testID={testID ? `${testID}-activity-indicator` : undefined}
                    />
                  )
                : (
                    <Text
                      testID={testID ? `${testID}-label` : undefined}
                      className={styles.label({ className: textClassName })}
                    >
                      {text}
                    </Text>
                  )}
            </>
          )}
    </Pressable>
  );
}
