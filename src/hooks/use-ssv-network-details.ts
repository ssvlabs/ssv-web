import { isMainnetEnvironment } from "@/lib/utils/env-checker";
import { isAddress } from "viem";
import { z } from "zod";

// Get the network that matches the current environment for app.ssv.network or app.hoodi.ssv.network
// NETWORKS will be an array with only one network -> hoodi or mainnet
export const NETWORKS = import.meta.env.VITE_SSV_NETWORKS.filter(
  (network) =>
    network.apiNetwork === (isMainnetEnvironment ? "mainnet" : "hoodi"),
);

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSSVNetworkDetails = () => {
  return NETWORKS[0];
};

export const useSSVNetworkDetails = () => {
  return NETWORKS[0];
};
