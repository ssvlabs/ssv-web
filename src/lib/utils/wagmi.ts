import { config } from "@/wagmi/config";
import type {
  WriteContractErrorType,
  WaitForTransactionReceiptErrorType,
} from "viem";

export const getChainName = (chainId: (typeof config.chains)[number]["id"]) => {
  return config.chains.find((chain) => chain.id === chainId)?.name;
};

export const getErrorMessage = (
  error: Error | WriteContractErrorType | WaitForTransactionReceiptErrorType,
) => {
  if ("shortMessage" in error) {
    if ("metaMessages" in error && error.metaMessages) {
      return `${error.shortMessage}\n\n${error.metaMessages[0]}`;
    }
    return error.shortMessage;
  }
  return error.message;
};
