import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getOwnerNonce } from "@/api/account";
import type { Address } from "abitype";

export const ownerNonceQueryOptions = (account: Address) => {
  return queryOptions({
    queryKey: ["owner-nonce", account],
    queryFn: () => getOwnerNonce(account),
  });
};

type UseOwnerNonceOptions = {
  options?: QueryConfig<typeof ownerNonceQueryOptions>;
};

export const useOwnerNonce = (
  account: Address,
  { options }: UseOwnerNonceOptions = {},
) => {
  return useQuery({
    ...ownerNonceQueryOptions(account),
    ...options,
  });
};
