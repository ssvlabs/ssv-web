import { createGuard } from "@/guard/create-guard";
import type { BApp, Strategy } from "@/api/b-app.ts";
import { isFrom } from "@/lib/utils/router.ts";

export const [CreateStrategyGuard, useCreateStrategyContext] = createGuard(
  {
    bApp: {} as BApp,
    strategyData: {} as Strategy,
    selectedObligations: {} as Record<`0x${string}`, number>,
    selectedFee: 0,
  },
  {
    "/account/strategies/create/bApps": (_, { resetState }) => {
      resetState();
    },
    "/account/strategies/create/obligations": (state) => {
      if (!Object.keys(state.bApp).length) {
        return "/account/strategies/create/bApps";
      }
    },
    "/account/strategies/create/fee": () => {
      if (
        !isFrom("/account/strategies/create/obligations") &&
        !isFrom("/account/strategies/create/metadata") &&
        !isFrom("/account/strategies/create/bApps")
      ) {
        return "/account/strategies/create/bApps";
      }
    },
    "/account/strategies/create/metadata": () => {
      if (!isFrom("/account/strategies/create/fee")) {
        return "/account/strategies/create/bApps";
      }
    },
  },
  false,
);
