import { useEffect, useState } from 'react'

/**
 * Returns the input value after it has been stable for `delay` ms.
 * Useful for debouncing inputs that drive expensive operations (network, etc.).
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handle)
  }, [value, delay])

  return debounced
}
