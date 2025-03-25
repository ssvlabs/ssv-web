import type { Strategy } from "@/api/b-app";

export const getStrategyName = (strategy: Pick<Strategy, "id" | "name">) => {
  return strategy.name || `Strategy ${strategy.id}`;
};
