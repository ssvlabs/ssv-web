import { useChainId } from "wagmi";
import { getAccount, getChainId } from "@wagmi/core";

import { networks, type Network } from "@/config/networks";
import { config, hoodi } from "@/wagmi/config";
import { useAccount } from "@/hooks/account/use-account";

export const getSSVNetworkDetails = (chainId?: number): Network => {
  const _chainId = chainId ?? getChainId(config);
  const { isConnected } = getAccount(config);
  return networks.find(
    (network) => network.networkId === (isConnected ? _chainId : hoodi.id),
  )!;
};

export const useSSVNetworkDetails = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return networks.find(
    (network) => network.networkId === (isConnected ? chainId : hoodi.id),
  )!;
};
