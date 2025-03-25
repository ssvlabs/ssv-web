import { parseAsString, useQueryState } from "nuqs";

export const useStrategyIdFilter = () => {
  const [value, setValue] = useQueryState("id", parseAsString.withDefault(""));
  return { value, setValue };
};
