import { locationState } from "@/app/routes/router";
import { useAccountState } from "@/hooks/account/use-account-state";
import { Navigate } from "react-router";
import { cn } from "@/lib/utils/tw.ts";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { motion } from "framer-motion";

export const Redirector = () => {
  const { isLoadingClusters, isLoadingOperators, hasClusters, hasOperators } =
    useAccountState();

  const landingPage =
    locationState.previous.pathname + locationState.previous.search;

  const landedOnClusterPage = landingPage.startsWith("/clusters");
  const landedOnOperatorsPage = landingPage.startsWith("/operators");

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
  if (landedOnClusterPage && hasClusters)
    return <Navigate to={landingPage} replace />;

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

  if (landedOnOperatorsPage && hasOperators)
    return <Navigate to={landingPage} replace />;

  return <Navigate to="/join" replace />;
};
