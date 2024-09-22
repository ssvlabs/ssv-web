import type { UseQueryOptions } from "@/lib/react-query";
import { ensureValidatorsUniqueness } from "@/lib/utils/keyshares";

import { useQuery } from "@tanstack/react-query";
import type { KeySharesItem } from "ssv-keys";

export const useKeysharesValidatorsValidation = (
  keyshares?: KeySharesItem[],
  options: UseQueryOptions = { enabled: true },
) => {
  return useQuery({
    queryKey: ["keyshares-validators-validation", keyshares],
    queryFn: () => ensureValidatorsUniqueness(keyshares!),
    retry: false,
    ...options,
    enabled: Boolean(keyshares && keyshares && options.enabled),
  });
};
