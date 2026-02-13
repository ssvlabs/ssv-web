import { Buffer } from "buffer";
import type { SSVKeys as SSVKeysType } from "@ssv-labs/ssv-sdk/keys";
self.Buffer = Buffer;

type ExtractedKeys = Awaited<ReturnType<SSVKeysType["extractKeys"]>>;

const { SSVKeys } = await import("@ssv-labs/ssv-sdk/keys");
const ssvKeys = new SSVKeys();

export type KeystoreDataMessage = MessageEvent<{
  file: File;
  password: string;
}>;

export type KeystoreResponseMessage = MessageEvent<
  | {
      error: Error;
      data: null;
    }
  | {
      error: null;
      data: ExtractedKeys;
    }
>;

self.onmessage = async function (e: KeystoreDataMessage) {
  try {
    const { file, password } = e.data;
    const text = await file.text();
    const result = await ssvKeys.extractKeys(text, password);
    self.postMessage({
      error: null,
      data: result,
    });
  } catch (error) {
    self.postMessage({
      error,
      data: null,
    });
  }
};
