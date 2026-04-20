import type { UseQueryOptions } from "@/lib/react-query";
import { ensureValidatorsUniqueness } from "@/lib/utils/keyshares";

import { useQuery } from "@tanstack/react-query";
import type { KeySharesItem } from "@ssv-labs/ssv-sdk/keys";
import { useChainId } from "wagmi";

export const useKeysharesValidatorsValidation = (
  keyshares?: KeySharesItem[],
  options: UseQueryOptions = { enabled: true },
) => {
  const chainId = useChainId();
  return useQuery({
    queryKey: ["keyshares-validators-validation", keyshares, chainId],
    queryFn: () => ensureValidatorsUniqueness(keyshares!),
    retry: false,
    ...options,
    enabled: Boolean(keyshares && keyshares && options.enabled),
  });
};
