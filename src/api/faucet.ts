import { endpoint } from "@/api";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { api } from "@/lib/api-client";
import type { AxiosError } from "axios";

type FaucetConfigResponse = {
  id: number;
  amount_to_transfer: number;
  transactions_capacity: number;
  updated_at: string;
  created_at: string;
  network: string;
}[];

/**
 * Get the amount to transfer from the faucet
 */
export const getFaucetConfig = async () =>
  api.get<FaucetConfigResponse>(endpoint("faucet/config"));

export type RequestSSVError = AxiosError<{
  error: {
    code: number;
    message: string;
    messages: string[];
  };
}>;
export const requestSSV = async (address: string) => {
  const ssvNetwork = getSSVNetworkDetails();
  return api.post(endpoint("faucet"), {
    owner_address: address,
    networkId: ssvNetwork.networkId,
    version: ssvNetwork.apiVersion,
  });
};
