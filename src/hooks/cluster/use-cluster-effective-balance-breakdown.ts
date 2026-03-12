import { useQuery } from "@tanstack/react-query";
import { getValidatorsStatusCounts } from "@/api/validators";
import { useLocalStorage } from "react-use";
import type { ValidatorStatusFilterKey } from "@/lib/search-parsers/validators-search-parsers";

export const useClusterEffectiveBalanceBreakdown = (clusterHash: string) => {
  // TODO: remove this once tested
  const [mockData] = useLocalStorage<
    Record<ValidatorStatusFilterKey, number> | undefined
  >("mockEbBreakdown", undefined);

  return useQuery({
    // TODO: remove mockData once tested
    queryKey: ["validators-status-counts", clusterHash, mockData],
    queryFn: () =>
      mockData || getValidatorsStatusCounts(clusterHash).then((res) => res.eb),
  });
};
