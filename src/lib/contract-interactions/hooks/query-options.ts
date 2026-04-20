import { getChainId } from "@wagmi/core";
import type { Address } from "abitype";
import type { ExtractAbiFunction } from "abitype";
import { GetterABI } from "@/lib/abi/getter.ts";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  extractAbiFunction,
  paramsToArray,
} from "@/lib/contract-interactions/utils";
import { queryClient } from "@/lib/react-query";
import { config } from "@/wagmi/config";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { readContractQueryOptions } from "wagmi/query";

type GetOperatorByIdFn = ExtractAbiFunction<
  typeof GetterABI,
  "getOperatorById"
>;
type IsWhitelistingContractFn = ExtractAbiFunction<
  typeof GetterABI,
  "isWhitelistingContract"
>;
type IsAddressWhitelistedFn = ExtractAbiFunction<
  typeof GetterABI,
  "isAddressWhitelistedInWhitelistingContract"
>;

const getOperatorByIdAbiFunction = extractAbiFunction(
  GetterABI,
  "getOperatorById",
);
const isWhitelistingContractAbiFunction = extractAbiFunction(
  GetterABI,
  "isWhitelistingContract",
);
const isAddressWhitelistedAbiFunction = extractAbiFunction(
  GetterABI,
  "isAddressWhitelistedInWhitelistingContract",
);

export const getGetOperatorByIdQueryOptions = (
  params: AbiInputsToParams<GetOperatorByIdFn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "getOperatorById",
    args: paramsToArray({ params, abiFunction: getOperatorByIdAbiFunction }),
  });

export const fetchGetOperatorById = (
  params: AbiInputsToParams<GetOperatorByIdFn["inputs"]>,
) => queryClient.fetchQuery(getGetOperatorByIdQueryOptions(params));

export const getIsWhitelistingContractQueryOptions = (
  params: AbiInputsToParams<IsWhitelistingContractFn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "isWhitelistingContract",
    args: paramsToArray({
      params,
      abiFunction: isWhitelistingContractAbiFunction,
    }),
  });

export const fetchIsWhitelistingContract = (
  params: AbiInputsToParams<IsWhitelistingContractFn["inputs"]>,
) => queryClient.fetchQuery(getIsWhitelistingContractQueryOptions(params));

export const getIsAddressWhitelistedInWhitelistingContractQueryOptions = (
  params: AbiInputsToParams<IsAddressWhitelistedFn["inputs"]>,
) =>
  readContractQueryOptions(config, {
    abi: GetterABI,
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "isAddressWhitelistedInWhitelistingContract",
    args: paramsToArray({
      params,
      abiFunction: isAddressWhitelistedAbiFunction,
    }),
  });

export const fetchIsAddressWhitelistedInWhitelistingContract = (
  params: AbiInputsToParams<IsAddressWhitelistedFn["inputs"]>,
) =>
  queryClient.fetchQuery(
    getIsAddressWhitelistedInWhitelistingContractQueryOptions(params),
  );

export const isAddressWhitelistedInWhitelistingContract = async (
  whitelistingContract: Address,
  operatorId: bigint,
  addressToCheck: Address,
) => {
  return fetchIsAddressWhitelistedInWhitelistingContract({
    whitelistingContract,
    operatorId,
    addressToCheck,
  });
};
