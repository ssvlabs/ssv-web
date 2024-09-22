import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CreateSharesMessage } from "@/workers/create-keystore-payload";
import type { IOperator } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/IOperator";
import type { KeySharesPayload } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/KeySharesPayload";

import { KeySharesItem, SSVKeys } from "ssv-keys";
const ssvKeys = new SSVKeys();

const createAndEncryptShares = async (
  privateKey: string,
  operators: IOperator[],
) => {
  const threshold = await ssvKeys.createThreshold(privateKey, operators);
  const encryptedShares = await ssvKeys.encryptShares(
    operators,
    threshold.shares,
  );
  return {
    threshold,
    encryptedShares,
  };
};

export const createKeystorePayload = async (
  data: CreateSharesMessage["data"],
) => {
  const { threshold, encryptedShares } = await createAndEncryptShares(
    data.privateKey,
    data.operators,
  );

  const shares = (await new KeySharesItem().buildPayload(
    {
      publicKey: threshold.publicKey,
      operators: data.operators,
      encryptedShares,
    },
    {
      ownerAddress: data.account,
      ownerNonce: data.nonce,
      privateKey: data.privateKey,
    },
  )) as KeySharesPayload;

  return shares;
};

export const useCreateShares = (
  options: MutationConfig<typeof createKeystorePayload> = {},
) => {
  return useMutation({
    mutationFn: createKeystorePayload,
    ...options,
  });
};
