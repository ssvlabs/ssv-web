import { createGuard } from "@/guard/create-guard";

export const [CreateStrategyGuard, useCreateStrategyContext] = createGuard(
  {
    createdStrategyId: -1,
    createdStrategyRegisteredHash: "" as `0x${string}`,
  },
  {},
);