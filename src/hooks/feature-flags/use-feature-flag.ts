import { useLocalStorage } from "react-use";
import { useMemo } from "react";

export const useFeatureFlag = (
  key: string,
  initialValue: boolean,
  options?:
    | {
        raw: true;
      }
    | {
        raw: false;
        serializer: (value: boolean) => string;
        deserializer: (value: string) => boolean;
      }
    | undefined,
) => {
  const [enabled, setEnabled, remove] = useLocalStorage(
    key,
    initialValue,
    options,
  );

  return useMemo(
    () => ({
      enabled,
      disable: () => setEnabled(false),
      enable: () => setEnabled(true),
      remove,
    }),
    [enabled, setEnabled, remove],
  );
};
