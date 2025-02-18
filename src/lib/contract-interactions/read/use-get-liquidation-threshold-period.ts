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

export const getGetLiquidationThresholdPeriodQueryOptions = () =>
  readContractQueryOptions(config, {
    abi: MainnetV4GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getLiquidationThresholdPeriod",
  });

type QueryOptions = UseReadContractParameters<
  typeof MainnetV4GetterABI,
  "getLiquidationThresholdPeriod"
>["query"];

export const fetchGetLiquidationThresholdPeriod = () =>
  queryClient.fetchQuery(getGetLiquidationThresholdPeriodQueryOptions());

export const useGetLiquidationThresholdPeriod = (
  options: QueryOptions & { watch?: boolean } = { enabled: true },
) => {
  const { getterContractAddress } = useSSVNetworkDetails();

  const blockNumber = useBlockNumber({ watch: options.watch });

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getLiquidationThresholdPeriod",

    blockNumber: options.watch ? blockNumber.data : undefined,
    query: { ...options },
  });
};

// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------
