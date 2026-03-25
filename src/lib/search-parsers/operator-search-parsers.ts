import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { z } from "zod";

import {
  addressesParser,
  defaultSearchOptions,
  getEffectiveBalanceParser,
} from "@/lib/search-parsers/shared/parsers";
import { paginationSearchParsers } from "@/lib/search-parsers/pagination-parsers";
import { MEV_RELAYS_VALUES, STATUS_API_VALUES } from "@/lib/utils/operator";
import { getSortingStateParser, parseAsTuple } from "@/lib/utils/parsers";
import { sortNumbers } from "@/lib/utils/number";
import type { ExtendedSortingState } from "@/types/data-table";
import type { OperatorSortingKeys } from "@/types/api";
import type { InferredSearchFilters } from "@/lib/search-parsers/types";

export const operatorSearchFilters = {
  search: parseAsString.withDefault("").withOptions(defaultSearchOptions),
  id: parseAsArrayOf(z.number({ coerce: true }))
    .withDefault([])
    .withOptions(defaultSearchOptions),
  name: parseAsArrayOf(z.string())
    .withDefault([])
    .withOptions(defaultSearchOptions),
  ownerAddress: addressesParser,
  location: parseAsArrayOf(z.string()).withOptions(defaultSearchOptions),
  eth1: parseAsArrayOf(z.string())
    .withDefault([])
    .withOptions(defaultSearchOptions),
  eth2: parseAsArrayOf(z.string())
    .withDefault([])
    .withOptions(defaultSearchOptions),
  ssvClient: parseAsArrayOf(z.string())
    .withDefault([])
    .withOptions(defaultSearchOptions),
  has_dkg_address: parseAsBoolean.withOptions(defaultSearchOptions),
  mev: parseAsArrayOf(z.enum(MEV_RELAYS_VALUES))
    .withDefault([])
    .withOptions(defaultSearchOptions),
  fee: parseAsTuple(
    z.tuple([z.number({ coerce: true }), z.number({ coerce: true })]),
    {
      postParse: sortNumbers,
    },
  )
    .withDefault([0, 200])
    .withOptions({
      ...defaultSearchOptions,
      throttleMs: 500,
    }),
  ethFee: parseAsTuple(
    z.tuple([z.number({ coerce: true }), z.number({ coerce: true })]),
    {
      postParse: sortNumbers,
    },
  )
    .withDefault([0, 10])
    .withOptions({
      ...defaultSearchOptions,
      throttleMs: 500,
    }),
  validatorsCount: parseAsTuple(
    z.tuple([z.number({ coerce: true }), z.number({ coerce: true })]),
    {
      postParse: sortNumbers,
    },
  )
    .withDefault([0, 3000])
    .withOptions(defaultSearchOptions),
  effectiveBalance: getEffectiveBalanceParser({ serializeToGwei: false }),
  status: parseAsArrayOf(z.enum(STATUS_API_VALUES))
    .withDefault([])
    .withOptions(defaultSearchOptions),
  isPrivate: parseAsBoolean.withOptions(defaultSearchOptions),
  type: parseAsStringEnum([
    "verified_operator",
    "dapp_node",
    "operator",
  ]).withOptions(defaultSearchOptions),

  performance24h: parseAsTuple(
    z.tuple([
      z.number({ coerce: true }).transform((v) => Math.round(v)),
      z.number({ coerce: true }).transform((v) => Math.round(v)),
    ]),
    {
      postParse: sortNumbers,
    },
  )
    .withDefault([0, 100])
    .withOptions(defaultSearchOptions),
  performance30d: parseAsTuple(
    z.tuple([
      z.number({ coerce: true }).transform((v) => Math.round(v)),
      z.number({ coerce: true }).transform((v) => Math.round(v)),
    ]),
  )
    .withDefault([0, 100])
    .withOptions(defaultSearchOptions),
  updatedAt: parseAsInteger,
};

export type OperatorSearchFilterKeys = keyof typeof operatorSearchFilters;

export const defaultOperatorSort: ExtendedSortingState<OperatorSortingKeys> = [
  { id: "id", desc: true },
];

export const operatorSearchSort = {
  ordering: getSortingStateParser<OperatorSortingKeys>()
    .withDefault(defaultOperatorSort)
    .withOptions({
      ...defaultSearchOptions,
      clearOnDefault: false,
    }),
};

export const operatorSearchParsers = {
  ...paginationSearchParsers,
  ...operatorSearchFilters,
  ...operatorSearchSort,
};
export const operatorSearchParamsSerializer = createSerializer(
  operatorSearchParsers,
  {
    clearOnDefault: false,
  },
);

export type OperatorsSearchSchema = InferredSearchFilters<
  typeof operatorSearchParsers
>;
