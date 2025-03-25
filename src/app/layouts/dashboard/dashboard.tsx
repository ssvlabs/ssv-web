import { Navbar } from "@/app/layouts/dashboard/navbar";
import { TransactionModal } from "@/components/ui/transaction-modal";
import { useBlockNavigationOnPendingTx } from "@/hooks/use-block-navigation-on-pending-tx";
import { cn } from "@/lib/utils/tw";
import { useIsRestoring } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentPropsWithRef, FC } from "react";
import { useAccount } from "@/hooks/account/use-account";
import { useMaintenance } from "@/hooks/app/use-maintenance";
import { Navigate } from "react-router";
import { MultisigTransactionModal } from "@/components/ui/multisig-transaction-modal";
import { useIdentify } from "@/lib/analytics/mixpanel/useIdentify";
import { useTrackPageViews } from "@/lib/analytics/mixpanel/useTrackPageViews";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { useAccountState } from "@/hooks/account/use-account-state.ts";
import { AssetsDelegationModal } from "@/components/modals/bapp/assets-delegation-modal";

export const DashboardLayout: FC<ComponentPropsWithRef<"div">> = ({
  children,
  className,
}) => {
  useIdentify();
  useTrackPageViews();
  useBlockNavigationOnPendingTx();

  const isRestoring = useIsRestoring();
  const account = useAccount();

  const { isMaintenancePage } = useMaintenance();
  const { isLoadingClusters, isLoadingOperators } = useAccountState();
  if (isMaintenancePage) {
    return <Navigate to="/maintenance" replace />;
  }
  return (
    <>
      <AnimatePresence>
        {isRestoring ||
        account.isReconnecting ||
        isLoadingClusters ||
        isLoadingOperators ? (
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
        ) : (
          <motion.div
            className={cn(
              "text-gray-800 flex flex-col h-screen max-h-screen overflow-hidden",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="content"
          >
            <Navbar />
            <main
              className={cn(className, "flex-1 overflow-auto")}
              style={{
                scrollbarGutter: "stable",
              }}
            >
              {children}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <TransactionModal />
      <AssetsDelegationModal />
      <MultisigTransactionModal />
    </>
  );
};

DashboardLayout.displayName = "Layout";
