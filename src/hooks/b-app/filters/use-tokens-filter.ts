import { parseAsArrayOf, useQueryState } from "nuqs";
import { isAddress } from "viem";
import { z } from "zod";

export const useTokensFilter = () => {
  const [value, set] = useQueryState(
    "token",
    parseAsArrayOf(z.string().refine(isAddress)),
  );
  return { value, set };
};
