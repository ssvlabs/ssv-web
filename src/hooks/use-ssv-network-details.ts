import { isAddress } from "viem";
import { useChainId } from "wagmi";
import { z } from "zod";

import { config } from "@/wagmi/config";
import { getAccount, getChainId } from "@wagmi/core";
import { useAccount } from "@/hooks/account/use-account";

const networks = import.meta.env.VITE_SSV_NETWORKS;

const networkSchema = z
  .array(
    z.object({
      networkId: z.number(),
      api: z.string(),
      apiVersion: z.string(),
      apiNetwork: z.string(),
      explorerUrl: z.string(),
      insufficientBalanceUrl: z.string(),
      googleTagSecret: z.string().optional(),
      tokenAddress: z.string().refine(isAddress).optional(),
      setterContractAddress: z.string().refine(isAddress).optional(),
      getterContractAddress: z.string().refine(isAddress).optional(),
    }),
  )
  .min(1);

if (!networks) {
  throw new Error(
    "VITE_SSV_NETWORKS is not defined in the environment variables",
  );
}

const parsed = networkSchema.safeParse(networks);

if (!parsed.success) {
  throw new Error(
    `
Invalid network schema in VITE_SSV_NETWORKS environment variable:
\t${parsed.error?.errors
      .map((error) => `${error.path.join(".")} -> ${error.message}`)
      .join("\n\t")}
    `,
  );
}

export const getSSVNetworkDetails = (chainId?: number) => {
  const _chainId = chainId ?? getChainId(config);
  const { isConnected } = getAccount(config);
  return networks.find(
    (network) => network.networkId === (isConnected ? _chainId : 17000),
  )!;
};

export const useSSVNetworkDetails = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return import.meta.env.VITE_SSV_NETWORKS.find(
    (network) => network.networkId === (isConnected ? chainId : 17000),
  )!;
};
