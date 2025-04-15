import { parseAsInteger } from "nuqs";

export const paginationSearchParsers = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
};
