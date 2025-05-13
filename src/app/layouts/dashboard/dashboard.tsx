import { Navbar } from "@/app/layouts/dashboard/navbar";
import { NavbarDVT } from "@/app/layouts/dashboard/navbar-dvt";
import { AssetWithdrawalModal } from "@/components/modals/bapp/asset-withdrawal-modal";
import { AssetsDepositModal } from "@/components/modals/bapp/assets-deposit-modal";
import { BatchTransactionModal } from "@/components/modals/batch-transaction-modal";
import { MultisigTransactionModal } from "@/components/ui/multisig-transaction-modal";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { TransactionModal } from "@/components/ui/transaction-modal";
import { useAccount } from "@/hooks/account/use-account";
import { useAccountState } from "@/hooks/account/use-account-state.ts";
import { useMaintenance } from "@/hooks/app/use-maintenance";
import { useAppVersion } from "@/hooks/temp-delete-after-merge/use-app-version";
import { useBlockNavigationOnPendingTx } from "@/hooks/use-block-navigation-on-pending-tx";
import { useIdentify } from "@/lib/analytics/mixpanel/useIdentify";
import { useTrackPageViews } from "@/lib/analytics/mixpanel/useTrackPageViews";
import { BatchTransactionProvider } from "@/lib/machines/batch-transactions/context";
import { cn } from "@/lib/utils/tw";
import { useIsRestoring } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentPropsWithRef, FC } from "react";
import { Navigate } from "react-router";

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
  const app = useAppVersion();
  if (isMaintenancePage) {
    return <Navigate to="/maintenance" replace />;
  }
  return (
    <>
      <BatchTransactionProvider>
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
              {app.isDvtOnly ? (
                <NavbarDVT className="px-5" />
              ) : (
                <Navbar className="px-5" />
              )}
              <main className={cn(className, "flex-1 overflow-auto")}>
                {children}
              </main>
            </motion.div>
          )}
        </AnimatePresence>
        <TransactionModal />
        <AssetsDepositModal />
        <AssetWithdrawalModal />
        <MultisigTransactionModal />
        <BatchTransactionModal />
      </BatchTransactionProvider>
    </>
  );
};

DashboardLayout.displayName = "Layout";
