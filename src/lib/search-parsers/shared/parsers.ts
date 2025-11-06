import { parseAsArrayOf, type Options } from "nuqs";
import { type Address, type Hex, isAddress } from "viem";
import { z } from "zod";

import { sortNumbers } from "@/lib/utils/number";
import { parseAsTuple } from "@/lib/utils/parsers";

export const clusterRegex = /^(?:0x)?[a-fA-F0-9]{64}$/;
export const operatorRegex = /^\d{1,4}$/;
export const validatorRegex = /^(?:0x)?[a-fA-F0-9]{96}$/;
export const accountRegex = /^0x[a-fA-F0-9]{40}$/;

export const parseSearchInput = (search: string) => {
  if (clusterRegex.test(search)) {
    return { type: "cluster", value: search, isExactMatch: true } as const;
  }
  if (operatorRegex.test(search)) {
    return { type: "operator", value: search, isExactMatch: false } as const;
  }
  if (validatorRegex.test(search)) {
    return { type: "validator", value: search, isExactMatch: true } as const;
  }
  if (accountRegex.test(search)) {
    return { type: "account", value: search, isExactMatch: true } as const;
  }
  return { type: "free-text", value: search, isExactMatch: false } as const;
};

export const isClusterId = (search: string): search is Hex =>
  clusterRegex.test(search);
export const isOperatorId = (search: string) => operatorRegex.test(search);
export const isValidatorPublicKey = (search: string): search is Hex =>
  validatorRegex.test(search);
export const isAccountAddress = (search: string): search is Address =>
  accountRegex.test(search);

export const defaultSearchOptions: Options = {
  history: "push",
  shallow: false,
  clearOnDefault: true,
};

export const addressesParser = parseAsArrayOf(
  z.string().refine(isAddress),
).withOptions(defaultSearchOptions);

export const clustersParser = parseAsArrayOf(
  z.string().refine(isClusterId),
).withOptions(defaultSearchOptions);

export const publicKeysParser = parseAsArrayOf(
  z.string().refine(isValidatorPublicKey),
).withOptions(defaultSearchOptions);

export const numberRangeParser = parseAsTuple(
  z.tuple([z.number({ coerce: true }), z.number({ coerce: true })]),
  {
    postParse: sortNumbers,
  },
).withOptions({
  ...defaultSearchOptions,
  throttleMs: 500,
});
