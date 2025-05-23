// ------------------------------------------------
// This file is auto-generated by createReadsBApps.cjs
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract, useBlockNumber } from "wagmi";

import {
  useSSVNetworkDetails,
  getSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { BAppABI } from "@/lib/abi/b-app/b-app";

import { readContractQueryOptions } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

export const getFeeTimelockPeriodQueryOptions = () =>
  readContractQueryOptions(config, {
    abi: BAppABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().bAppContractAddress,
    functionName: "feeTimelockPeriod",
  });

type QueryOptions = UseReadContractParameters<
  typeof BAppABI,
  "feeTimelockPeriod"
>["query"];

export const fetchFeeTimelockPeriod = () =>
  queryClient.fetchQuery(getFeeTimelockPeriodQueryOptions());

export const useFeeTimelockPeriod = (
  options: QueryOptions & { watch?: boolean } = { enabled: true },
) => {
  const { bAppContractAddress } = useSSVNetworkDetails();

  const blockNumber = useBlockNumber({ watch: options.watch });

  return useReadContract({
    abi: BAppABI,
    address: bAppContractAddress,
    functionName: "feeTimelockPeriod",

    blockNumber: options.watch ? blockNumber.data : undefined,
    query: { ...options },
  });
};

// ------------------------------------------------
// This file is auto-generated by createReadsBApps.cjs
// ------------------------------------------------
