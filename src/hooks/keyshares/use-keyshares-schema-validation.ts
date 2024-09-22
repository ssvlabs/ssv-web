import type { QueryConfig } from "@/lib/react-query";
import {
  KeysharesValidationError,
  KeysharesValidationErrors,
} from "@/lib/utils/keyshares";
import { keysharesSchema } from "@/lib/zod/keyshares";
import { useQuery } from "@tanstack/react-query";
import { KeyShares } from "ssv-keys";

export const createKeysharesFromFile = async (file: File) => {
  const text = await file!.text();
  const json = JSON.parse(text);
  const { success } = keysharesSchema.safeParse(json);
  if (!success) {
    throw new KeysharesValidationError(
      KeysharesValidationErrors.InvalidFileType,
    );
  }
  return (await KeyShares.fromJson(json)).list();
};

export const useKeysharesSchemaValidation = (
  file: File | null,
  options: QueryConfig = {},
) => {
  return useQuery({
    queryKey: ["keyshares-schema-validation", file],
    queryFn: () => createKeysharesFromFile(file!),
    retry: false,
    enabled: Boolean(file),
    ...options,
  });
};
