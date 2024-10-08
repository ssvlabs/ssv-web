import type { IOperator } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/IOperator";
import type { Address } from "viem";

import { Buffer } from "buffer";
import type { KeySharesPayload } from "ssv-keys/dist/tsc/src/lib/KeyShares/KeySharesData/KeySharesPayload";
self.Buffer = Buffer;

const { SSVKeys, KeySharesItem } = await import("ssv-keys");
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

export type CreateSharesMessage = MessageEvent<{
  account: Address;
  nonce: number;
  privateKey: string;
  operators: IOperator[];
}>;

export type CreateShareSuccess = {
  error: null;
  data: KeySharesPayload;
};

export type CreateShareError = {
  error: unknown;
  data: null;
};

export type CreateSharesResponseMessage =
  | MessageEvent<CreateShareSuccess>
  | MessageEvent<CreateShareError>;

self.onmessage = async function ({ data }: CreateSharesMessage) {
  try {
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

    self.postMessage({
      error: null,
      data: shares,
    } satisfies CreateShareSuccess);
  } catch (error) {
    self.postMessage({
      error,
      data: null,
    } satisfies CreateShareError);
  }
};
