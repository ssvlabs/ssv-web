// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract, useBlockNumber } from "wagmi";

import { isUndefined } from "lodash-es";

import {
  getSSVNetworkDetails,
  useSSVNetworkDetails,
} from "@/hooks/use-ssv-network-details";
import { MainnetV4GetterABI } from "@/lib/abi/mainnet/v4/getter";
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

type Fn = ExtractAbiFunction<typeof MainnetV4GetterABI, "getBurnRate">;
const abiFunction = extractAbiFunction(MainnetV4GetterABI, "getBurnRate");

export const getGetBurnRateQueryOptions = (
  params: AbiInputsToParams<Fn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: MainnetV4GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getBurnRate",
    args: paramsToArray({ params, abiFunction }),
  });

type QueryOptions = UseReadContractParameters<
  typeof MainnetV4GetterABI,
  "getBurnRate"
>["query"];

export const fetchGetBurnRate = (params: AbiInputsToParams<Fn["inputs"]>) =>
  queryClient.fetchQuery(getGetBurnRateQueryOptions(params));

export const useGetBurnRate = (
  params: AbiInputsToParams<Fn["inputs"]>,
  options: QueryOptions & { watch?: boolean } = { enabled: true },
) => {
  const { getterContractAddress } = useSSVNetworkDetails();
  const args = paramsToArray({ params, abiFunction });
  const blockNumber = useBlockNumber({ watch: options.watch });

  return useReadContract({
    abi: MainnetV4GetterABI,
    address: getterContractAddress,
    functionName: "getBurnRate",
    args,
    blockNumber: options.watch ? blockNumber.data : undefined,
    query: {
      ...options,
      enabled: options?.enabled && args.every((arg) => !isUndefined(arg)),
    },
  });
};

// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------