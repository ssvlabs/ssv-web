import { createGuard } from "@/guard/create-guard";
import type { BApp, Strategy } from "@/api/b-app.ts";

export const [CreateStrategyGuard, useCreateStrategyContext] = createGuard(
  {
    bApp: {} as BApp,
    strategyData: {} as Strategy,
    selectedObligations: {} as Record<`0x${string}`, number>,
    selectedFee: 0,
  },
  {},
  false,
);
