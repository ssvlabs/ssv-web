import { useState } from "react";
import { useDebounce } from "react-use";

export const useDebouncedValue = <T>(initialValue: T, delay: number = 500) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useDebounce(
    () => {
      setDebouncedValue(value);
    },
    delay,
    [value],
  );

  return {
    value,
    debouncedValue,
    setValue,
  };
};
