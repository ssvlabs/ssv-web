import { locationState } from "@/app/routes/router";
import { useAccountState } from "@/hooks/account/use-account-state";
import { Navigate } from "react-router";
import { cn } from "@/lib/utils/tw.ts";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { motion } from "framer-motion";
import { useAppVersion } from "@/hooks/temp-delete-after-merge/use-app-version";

export const Redirector = () => {
  const { isLoadingClusters, isLoadingOperators, hasClusters, hasOperators } =
    useAccountState();

  const referral =
    locationState.previous.pathname + locationState.previous.search;
  const clusterMatch = referral.match(/clusters/);
  const operatorMatch = referral.match(/operators/);

  const app = useAppVersion();

  if (isLoadingClusters)
    return (
      <motion.div
        className={cn(
          "fixed flex-col gap-1 bg-gray-50 inset-0 flex h-screen items-center justify-center",
        )}
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SsvLoader className={"size-[160px]"} />
      </motion.div>
    );
  if (clusterMatch && hasClusters) return <Navigate to={referral} replace />;

  if (isLoadingOperators)
    return (
      <motion.div
        className={cn(
          "fixed flex-col gap-1 bg-gray-50 inset-0 flex h-screen items-center justify-center",
        )}
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SsvLoader className={"size-[160px]"} />
      </motion.div>
    );

  if (app.isDvtOnly) {
    if (operatorMatch && hasOperators)
      return <Navigate to={referral} replace />;

    if (hasClusters) return <Navigate to={"/clusters"} replace />;
    if (hasOperators) return <Navigate to={"/operators"} replace />;

    return <Navigate to="/join" replace />;
  }

  return <Navigate to="/account/my-delegations" />;
};
