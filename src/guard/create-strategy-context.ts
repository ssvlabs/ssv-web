import { createGuard } from "@/guard/create-guard";
import type { BApp, Strategy } from "@/api/b-app.ts";
import { isFrom } from "@/lib/utils/router.ts";

export const [CreateStrategyGuard, useCreateStrategyContext] = createGuard(
  {
    createdStrategyId: -1,
    createdStrategyRegisteredHash: "" as `0x${string}`,
    skippedBApp: false,
    bApp: {} as BApp,
    strategyData: {} as Strategy,
    selectedObligations: {} as Record<`0x${string}`, number>,
    selectedFee: 0,
    registerData: "" as `0x${string}`,
  },
  {
    "/account/strategies/:strategyId": (_, { params }) => {
      if (!Number(params.strategyId)) {
        return "/account/strategies/";
      }
    },
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

    "/account/my-strategies/:strategyId": (_, { params }) => {
      if (!Number(params.strategyId)) {
        return "/account/my-strategies/";
      }
    },
    "/account/my-strategies/create/bApps": (_, { resetState }) => {
      resetState();
    },
    "/account/my-strategies/create/obligations": (state) => {
      if (!Object.keys(state.bApp).length) {
        return "/account/my-strategies/create/bApps";
      }
    },
    "/account/my-strategies/create/fee": () => {
      if (
        !isFrom("/account/my-strategies/create/obligations") &&
        !isFrom("/account/my-strategies/create/metadata") &&
        !isFrom("/account/my-strategies/create/bApps")
      ) {
        return "/account/my-strategies/create/bApps";
      }
    },
    "/account/my-strategies/create/metadata": () => {
      if (!isFrom("/account/my-strategies/create/fee")) {
        return "/account/my-strategies/create/bApps";
      }
    },
  },
  false,
);
