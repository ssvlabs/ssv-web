import type { Keyshares } from "@/types/keyshares";
import { z } from "zod";

export const operatorSchema = z.object({
  id: z.number(),
  operatorKey: z.string(),
});

export const payloadSchema = z.object({
  publicKey: z.string(),
  operatorIds: z.array(z.number()),
  sharesData: z.string(),
});

export const dataSchema = z.object({
  ownerNonce: z.number(),
  ownerAddress: z.string(),
  publicKey: z.string(),
  operators: z.array(operatorSchema),
});

export const shareSchema = z.object({
  data: dataSchema,
  payload: payloadSchema,
});

export const keysharesSchema = z.object({
  version: z.string(),
  createdAt: z.string(),
  shares: z.array(shareSchema),
}) satisfies z.ZodType<Keyshares>;
