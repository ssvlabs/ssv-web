import { getSlashableAssets } from "@/api/b-app";
import { useAccount } from "@/hooks/account/use-account";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";

export const useSlashableAssets = (ownerAddress?: string) => {
  const account = useAccount();
  const address = ownerAddress || account.address;

  return useChainedQuery({
    queryKey: ["slashable-assets", address],
    queryFn: () => getSlashableAssets(address!),
    enabled: !!address,
  });
};
