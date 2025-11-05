import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { z } from "zod";

import type { Operator, SearchValidator } from "@/types/api";
import {
  addressesParser,
  clustersParser,
  defaultSearchOptions,
  publicKeysParser,
} from "@/lib/search-parsers/shared/parsers";
import { getSortingStateParser } from "@/lib/utils/parsers";
import type { ExtendedSortingState } from "@/types/data-table";
import { paginationSearchParsers } from "@/lib/search-parsers/pagination-parsers";
import type { InferredSearchFilters } from "@/lib/search-parsers/types";

export const enhancementParsers = {
  fullOperatorData: parseAsBoolean.withDefault(true),
};

export const validatorsSearchFilters = {
  search: parseAsString.withOptions(defaultSearchOptions),
  publicKey: publicKeysParser,
  cluster: clustersParser,
  ownerAddress: addressesParser,
  operator: parseAsArrayOf(z.number({ coerce: true })).withOptions(
    defaultSearchOptions,
  ),
};

export type ValidatorSearchFilterKeys = keyof typeof validatorsSearchFilters;

export const defaultValidatorSort: ExtendedSortingState<
  SearchValidator<Operator>
> = [{ id: "created_at", desc: false }];

export const validatorSearchSort = {
  ordering: getSortingStateParser<SearchValidator<Operator>>()
    .withOptions(defaultSearchOptions)
    .withDefault(defaultValidatorSort),
};

export const elasticSearchParsers = {
  lastId: parseAsString,
  pageDirection: parseAsStringEnum<"next" | "prev">([
    "next",
    "prev",
  ]).withDefault("next"),
};

export const validatorsSearchParsers = {
  ...validatorsSearchFilters,
  ...enhancementParsers,
  ...validatorSearchSort,
  ...elasticSearchParsers,
  ...paginationSearchParsers,
};
export const validatorsSearchParamsSerializer = createSerializer(
  validatorsSearchParsers,
  {
    clearOnDefault: false,
  },
);

export type ValidatorsSearchSchema = InferredSearchFilters<
  typeof validatorsSearchParsers
>;
