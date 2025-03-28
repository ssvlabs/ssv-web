import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useOperator } from "@/hooks/operator/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "@/hooks/account/use-account";
import { Loading } from "@/components/ui/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { useAccountState } from "@/hooks/account/use-account-state";
import { SsvLoader } from "@/components/ui/ssv-loader.tsx";
import { cn } from "@/lib/utils/tw.ts";

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const accountState = useAccountState();
  const { address } = useAccount();

  const { operatorId } = useOperatorPageParams();
  const operator = useOperator(operatorId ?? "");

  if (isUndefined(operatorId)) return <Navigate to="../not-found" />;
  if (operator.isError || operator.data?.is_deleted)
    return <Navigate to="../not-found" />;
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  ) {
    if (accountState.isLoading) return <Loading />;
    if (accountState.isNewAccount) return <Navigate to="/join" />;
    if (accountState.hasOperators) return <Navigate to="/operators" />;
    if (accountState.hasClusters) return <Navigate to="/clusters" />;
  }

  return (
    <AnimatePresence mode="wait">
      {operator.isLoading ? (
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
          key="content"
          className="flex-1 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ProtectedOperatorRoute.displayName = "ProtectedOperatorRoute";
