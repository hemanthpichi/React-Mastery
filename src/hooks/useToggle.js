import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((lastValue) => !lastValue);
  }, []);

  return [value, toggle];
}
