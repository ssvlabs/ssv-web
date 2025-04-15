import { orderingSearchParsers } from "@/lib/search-parsers/ordering";
import { paginationSearchParsers } from "@/lib/search-parsers/pagination-parsers";
import type { InferredSearchFilters } from "@/lib/search-parsers/types";
import { parseAsString, createSerializer, parseAsArrayOf } from "nuqs";
import { isAddress } from "viem";
import { z } from "zod";

export const strategiesSearchFilters = {
  id: parseAsString,
  ordering: parseAsString,
  token: parseAsArrayOf(z.string().refine(isAddress)),
  bappId: parseAsString,
};

export const strategiesSearchParsers = {
  ...paginationSearchParsers,
  ...strategiesSearchFilters,
  ...orderingSearchParsers,
};

export const serializerStrategiesSearch = createSerializer(
  strategiesSearchParsers,
  {
    clearOnDefault: false,
  },
);

export type StrategiesSearchParams = Partial<
  InferredSearchFilters<typeof strategiesSearchParsers>
>;
