import { useQuery } from "@tanstack/react-query";
import { getValidatorsStatusCounts } from "@/api/validators";
import type { ValidatorStatusFilterKey } from "@/lib/search-parsers/validators-search-parsers";

export type BreakdownItem = {
  label: string;
  color: string;
  amount: number;
};

const statusConfig: Record<
  ValidatorStatusFilterKey,
  { label: string; color: string }
> = {
  active: { label: "Active", color: "#08c858" },
  inactive: { label: "Inactive", color: "#ec1c26" },
  notDeposited: { label: "Not Deposited", color: "#f59e0b" },
  pending: { label: "Depositing", color: "#c070ff" },
  slashed: { label: "Slashed", color: "#ef4444" },
  exiting: { label: "Exiting", color: "#f97316" },
  exited: { label: "Exited", color: "#3b82f6" },
};

export const useClusterEffectiveBalanceBreakdown = (clusterHash: string) => {
  return useQuery({
    queryKey: ["validators-status-counts", clusterHash],
    queryFn: () => getValidatorsStatusCounts(clusterHash).then((res) => res.eb),
    select: (eb): BreakdownItem[] => {
      if (!eb) return [];
      return Object.entries(eb)
        .filter(([, amount]) => amount > 0)
        .map(([key, amount]) => {
          const config = statusConfig[key as ValidatorStatusFilterKey] ?? {
            label: key,
            color: "#97a5ba",
          };
          return { label: config.label, color: config.color, amount };
        });
    },
  });
};
