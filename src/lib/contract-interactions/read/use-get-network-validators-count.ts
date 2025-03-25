// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract, useBlockNumber } from "wagmi";

import {
  getSSVNetworkDetails,
  useSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";

import { readContractQueryOptions } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

export const getGetNetworkValidatorsCountQueryOptions = () =>
  readContractQueryOptions(config, {
    abi: MainnetV4GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getNetworkValidatorsCount",
  });

type QueryOptions = UseReadContractParameters<
  typeof MainnetV4GetterABI,
  "getNetworkValidatorsCount"
>["query"];

export const fetchGetNetworkValidatorsCount = () =>
  queryClient.fetchQuery(getGetNetworkValidatorsCountQueryOptions());

export const useGetNetworkValidatorsCount = (
  options: QueryOptions & { watch?: boolean } = { enabled: true },
) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  const blockNumber = useBlockNumber({ watch: options.watch });

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getNetworkValidatorsCount",

    blockNumber: options.watch ? blockNumber.data : undefined,
    query: { ...options },
  });
};

// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------
