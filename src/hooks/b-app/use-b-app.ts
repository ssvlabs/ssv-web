import { getBAppByID } from "@/api/b-app.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Address } from "abitype";

export const useBApp = (bAppId?: Address) => {
  return useChainedQuery({
    queryKey: ["get_bApp", bAppId],
    queryFn: () => getBAppByID({ id: bAppId }),
    enabled: !!bAppId,
  });
};
