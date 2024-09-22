import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useOperator } from "@/hooks/operator/use-operator";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { isAddressEqual } from "viem";
import { useAccount } from "@/hooks/account/use-account";
import { Loading } from "@/components/ui/Loading";
import { AnimatePresence, motion } from "framer-motion"; // Add this import
// Add this import
// Add this import

export const ProtectedOperatorRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { address } = useAccount();
  const { operatorId } = useOperatorPageParams();
  const operator = useOperator(operatorId ?? "");

  if (isUndefined(operatorId)) return <Navigate to="../not-found" />;
  if (operator.isError || operator.data?.is_deleted)
    return <Navigate to="../not-found" />;
  if (
    operator.data &&
    !isAddressEqual(operator.data.owner_address as `0x${string}`, address!)
  )
    return <Navigate to="../not-your-operator" />;

  return (
    <AnimatePresence mode="wait">
      {operator.isLoading ? (
        <Loading />
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
