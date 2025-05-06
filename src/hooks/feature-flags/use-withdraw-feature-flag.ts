import { useFeatureFlag } from "@/hooks/feature-flags/use-feature-flag";

export const useStrategyAssetWithdrawFeatureFlag = () =>
  useFeatureFlag("strategyAssetWithdraw", false);
