import { useAccount } from "@/hooks/account/use-account";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useBalance } from "wagmi";

export const useSSVBalance = () => {
  const ssvNetworkDetails = useSSVNetworkDetails();
  const { address } = useAccount();

  return useBalance({
    address,
    token: ssvNetworkDetails?.tokenAddress,
  });
};
