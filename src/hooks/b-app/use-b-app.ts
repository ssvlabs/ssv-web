import { getBAppByID } from "@/api/b-app.ts";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";

export const useBApp = (bAppId?: Address) => {
  return useQuery({
    queryKey: ["get_bApp", bAppId],
    queryFn: () => getBAppByID({ id: bAppId }),
    enabled: !!bAppId,
  });
};
