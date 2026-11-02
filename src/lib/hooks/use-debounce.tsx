import * as React from 'react';

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Used for search inputs so we don't call the API on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
