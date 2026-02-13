import type { Address } from "viem";
import { isAddress } from "viem";
import { useChainId } from "wagmi";
import { z } from "zod";

import { config, hoodi } from "@/wagmi/config";
import { getAccount, getChainId } from "@wagmi/core";
import { useAccount } from "@/hooks/account/use-account";

export const NETWORKS = [
  {
    networkId: 560048,
    apiVersion: "v4",
    apiNetwork: "hoodi",
    api: "https://api.hoodi.ssv.network/api",
    explorerUrl: "https://explorer.hoodi.ssv.network/",
    insufficientBalanceUrl: "https://faucet.ssv.network",
    googleTagSecret: "GTM-K3GR7M5",
    tokenAddress: "0x9F5d4Ec84fC4785788aB44F9de973cF34F7A038e",
    setterContractAddress:
      "0x58410Bef803ECd7E63B23664C586A6DB72DAf59c" as Address,
    getterContractAddress:
      "0x5AdDb3f1529C5ec70D77400499eE4bbF328368fe" as Address,
  },
];

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

if (!NETWORKS) {
  throw new Error(
    "VITE_SSV_NETWORKS is not defined in the environment variables",
  );
}

const parsed = networkSchema.safeParse(NETWORKS);

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
  return NETWORKS.find(
    (network) => network.networkId === (isConnected ? _chainId : hoodi.id),
  )!;
};

export const useSSVNetworkDetails = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return import.meta.env.VITE_SSV_NETWORKS.find(
    (network) => network.networkId === (isConnected ? chainId : hoodi.id),
  )!;
};
