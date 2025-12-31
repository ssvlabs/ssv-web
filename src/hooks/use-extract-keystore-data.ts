import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

import { SSVKeys } from "@ssv-labs/ssv-sdk/keys";
const ssvKeys = new SSVKeys();

type ExtractedKeys = Awaited<ReturnType<SSVKeys["extractKeys"]>>;

type Params = {
  file: File;
  password: string;
};

export const extractKeys = async ({
  file,
  password,
}: Params): Promise<ExtractedKeys> => {
  const text = await file.text();
  return await ssvKeys.extractKeys(text, password);
  // return new Promise((resolve, reject) => {
  //   try {
  //     worker.onmessage = (e: KeystoreResponseMessage) => {
  //       const { data, error } = e.data;
  //       return error ? reject(error) : resolve(data);
  //     };
  //     worker.postMessage({ file, password });
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};

export const useExtractKeystoreData = (
  options: MutationConfig<typeof extractKeys> = {},
) => {
  return useMutation({
    mutationFn: extractKeys,
    ...options,
  });
};
