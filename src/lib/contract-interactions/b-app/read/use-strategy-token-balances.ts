// ------------------------------------------------
// This file is auto-generated by createReadsBApps.cjs
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract, useBlockNumber } from "wagmi";
import { isUndefined } from "lodash-es";

import {
  useSSVNetworkDetails,
  getSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { BAppABI } from "@/lib/abi/b-app/b-app";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { ExtractAbiFunction } from "abitype";
import { readContractQueryOptions } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

type Fn = ExtractAbiFunction<typeof BAppABI, "strategyTokenBalances">;
const abiFunction = extractAbiFunction(BAppABI, "strategyTokenBalances");

export const getStrategyTokenBalancesQueryOptions = (
  params: AbiInputsToParams<Fn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: BAppABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().bAppContractAddress,
    functionName: "strategyTokenBalances",
    args: paramsToArray({ params, abiFunction }),
  });

type QueryOptions = UseReadContractParameters<
  typeof BAppABI,
  "strategyTokenBalances"
>["query"];

export const fetchStrategyTokenBalances = (
  params: AbiInputsToParams<Fn["inputs"]>,
) => queryClient.fetchQuery(getStrategyTokenBalancesQueryOptions(params));

export const useStrategyTokenBalances = (
  params: AbiInputsToParams<Fn["inputs"]>,
  options: QueryOptions & { watch?: boolean } = { enabled: true },
) => {
  const { bAppContractAddress } = useSSVNetworkDetails();
  const args = paramsToArray({ params, abiFunction });
  const blockNumber = useBlockNumber({ watch: options.watch });

  return useReadContract({
    abi: BAppABI,
    address: bAppContractAddress,
    functionName: "strategyTokenBalances",
    args,
    blockNumber: options.watch ? blockNumber.data : undefined,
    query: {
      ...options,
      enabled: options?.enabled && args.every((arg) => !isUndefined(arg)),
    },
  });
};

// ------------------------------------------------
// This file is auto-generated by createReadsBApps.cjs
// ------------------------------------------------
