import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { add0x } from "@/lib/utils/strings";
import type { Address } from "abitype";

export interface IsRegisteredValidatorResponse {
  type: string;
  data: {
    id: number;
    network: string;
    version: string;
    ownerAddress: string;
    publicKey: string;
    operators: number[];
    cluster: string;
    shares: string;
    sharesPublicKeys: string[];
    encryptedKeys: string[];
    memo: string;
    blockNumber: number;
    logIndex: number;
    transactionIndex: number;
    addedAtBlockNumber: number;
    addedAtLogIndex: number;
    addedAtTransactionIndex: number;
    isValid: boolean;
    isDeleted: boolean;
    isLiquidated: boolean;
    ignoreOnSync: boolean;
    createdAt: string;
    updatedAt: string;
    isDraft: boolean;
    isPublicKeyValid: boolean;
    isSharesValid: boolean;
    isOperatorsValid: boolean;
  };
}

export const getIsRegisteredValidator = async (publicKey: string) => {
  return await api.get<IsRegisteredValidatorResponse>(
    endpoint("validators/isRegisteredValidator", add0x(publicKey)),
  );
};

export const getAllValidators = async (clusterHash: string | Address) => {
  return await api.get<IsRegisteredValidatorResponse>(
    endpoint("validators/validatorsByClusterHash", add0x(clusterHash)),
  );
};
