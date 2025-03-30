import { getGlobalNonSlashableAssets } from "@/api/b-app";
import { useAccount } from "@/hooks/account/use-account";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";

export const useGlobalNonSlashableAssets = (account?: Address) => {
  const _account = useAccount();
  const address = account || _account.address;
  return useQuery({
    queryKey: ["global-non-slashable-assets", address],
    queryFn: () => getGlobalNonSlashableAssets({ account: address }),
  });
};
