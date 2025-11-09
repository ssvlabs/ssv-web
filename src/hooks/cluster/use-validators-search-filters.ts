import { useQueryStates } from "nuqs";
import { validatorsSearchFilters } from "@/lib/search-parsers/validators-search-parsers";

export const useValidatorsSearchFilters = () => {
  return useQueryStates(validatorsSearchFilters);
};
