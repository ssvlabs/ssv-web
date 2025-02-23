import { getSlashableAssets } from "@/api/b-app";
import { useAccount } from "@/hooks/account/use-account";
import { useQuery } from "@tanstack/react-query";

export const useSlashableAssets = (ownerAddress?: string) => {
  const account = useAccount();
  const address = ownerAddress || account.address;

  return useQuery({
    queryKey: ["slashable-assets", address, account.chainId],
    queryFn: () => getSlashableAssets(address!),
    enabled: !!address,
  });
};
