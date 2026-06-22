import { useState, useEffect } from "react";

// delays updating the returned value until user stops typing for `delay` ms
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup - if value changes before timeout finishes, cancel old timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
