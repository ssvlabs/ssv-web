import { isAddress } from "viem";
import { z } from "zod";

export const networkSchema = z.object({
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
});

export const networksSchema = z.array(networkSchema).min(1);

export type Network = z.infer<typeof networkSchema>;

const raw = import.meta.env.VITE_SSV_NETWORKS;

if (!raw) {
  throw new Error(
    "VITE_SSV_NETWORKS is not defined in the environment variables",
  );
}

let parsedJson: unknown;
try {
  parsedJson = JSON.parse(raw);
} catch (error) {
  throw new Error(
    `VITE_SSV_NETWORKS is not valid JSON: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
}

const result = networksSchema.safeParse(parsedJson);

if (!result.success) {
  throw new Error(
    `
Invalid network schema in VITE_SSV_NETWORKS environment variable:
\t${result.error.errors
      .map((error) => `${error.path.join(".")} -> ${error.message}`)
      .join("\n\t")}
    `,
  );
}

export const networks = result.data;
