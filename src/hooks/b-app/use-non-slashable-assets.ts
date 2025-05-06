import { getNonSlashableAssets } from "@/api/b-app";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Address } from "abitype";
import { isAddress } from "viem";

export const useNonSlashableAssets = (account?: Address) => {
  return useChainedQuery({
    queryKey: [account],
    queryFn: () => getNonSlashableAssets(account!),
    enabled: account && isAddress(account),
  });
};
