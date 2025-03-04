import { getNonSlashableAssets } from "@/api/b-app";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { isAddress } from "viem";

export const useNonSlashableAssets = (account?: Address) => {
  return useQuery({
    queryKey: [account],
    queryFn: () => getNonSlashableAssets(account!),
    enabled: account && isAddress(account),
  });
};
