import { isEmpty } from "lodash-es";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "react-use";

type UseSearchParamsStateOptions<T extends string> = {
  key: string;
  initialValue: T;
  debounce?: number;
};

export const useSearchParamsState = <T extends string>({
  key,
  initialValue,
  debounce = 500,
}: UseSearchParamsStateOptions<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get(key);

  const [value, _setValue] = useState(() => searchParam || initialValue);

  const [, cancel] = useDebounce(
    () => {
      const param = searchParams.get(key);
      if (isEmpty(param) && isEmpty(value)) return;
      if (param === value) return;

      setSearchParams((prev) => {
        if (!value) {
          prev.delete(key);
        } else {
          prev.set(key, value as string);
        }
        return prev;
      });
    },
    debounce,
    [value],
  );

  const setValue = useCallback(
    (newValue: T) => {
      cancel();
      _setValue(newValue);
    },
    [cancel],
  );

  useEffect(() => {
    _setValue((prev) => {
      if (prev !== searchParam) return searchParam ?? initialValue;
      return prev;
    });
  }, [initialValue, searchParam]);

  return [
    value,
    setValue,
    (searchParams.get(key) || initialValue) as T,
  ] as const;
};
