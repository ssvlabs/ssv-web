import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import type { Address } from "viem";
import { getAddress } from "viem";

export interface GetAccountResponse {
  type: string;
  data: {
    id: number;
    ownerAddress: Address;
    recipientAddress: Address;
    network: string;
    version: string;
    nonce: number;
  };
}

export type AccountStatsResponse = {
  type: string;
  data: {
    operators: number;
    clusters: number;
    validators: number;
    effectiveBalance: string;
    totalOperatorEthManaged: string;
  };
};

export const getAccount = (account: Address) =>
  api
    .get<GetAccountResponse>(endpoint("accounts", getAddress(account)))
    .then((res) => res.data);

export const getOwnerNonce = (account: Address) =>
  getAccount(account).then((res) => res.nonce);

export const getAccountStats = async (account: Address) =>
  api
    .get<AccountStatsResponse>(endpoint("accounts/counts", getAddress(account)))
    .then((res) => res.data);
