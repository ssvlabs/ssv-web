import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const schema = z.object({
  crypto: z.object({
    kdf: z.object({
      function: z.string(),
      params: z.object({
        dklen: z.number(),
        n: z.number(),
        r: z.number(),
        p: z.number(),
        salt: z.string(),
      }),
      message: z.string(),
    }),
    checksum: z.object({
      function: z.string(),
      params: z.object({}),
      message: z.string(),
    }),
    cipher: z.object({
      function: z.string(),
      params: z.object({ iv: z.string() }),
      message: z.string(),
    }),
  }),
  description: z.string(),
  pubkey: z.string(),
  path: z.string(),
  uuid: z.string(),
  version: z.number(),
});

export const useKeystoreValidation = (file: File | null) => {
  return useQuery({
    queryKey: ["keystore-validation", file],
    queryFn: async () => {
      const text = await file!.text();
      const json = JSON.parse(text);
      return schema.parse(json);
    },
    enabled: Boolean(file),
  });
};
