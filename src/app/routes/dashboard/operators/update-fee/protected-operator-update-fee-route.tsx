import { ProtectedClusterRoute } from "@/app/routes/protected-cluster-route";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import {
  useOperatorDeclaredFee,
  useOperatorDeclaredFeeStatus,
} from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate, useMatch } from "react-router-dom";

export const ProtectedOperatorUpdateFeeRoute: FC<
  ComponentPropsWithoutRef<"div">
> = ({ ...props }) => {
  const { operatorId } = useOperatorPageParams();

  const declaredFee = useOperatorDeclaredFee(BigInt(operatorId!));
  const status = useOperatorDeclaredFeeStatus(BigInt(operatorId!));

  const isEmptyRoute = useMatch("operators/:id/fee");
  const isDefaultRoute = useMatch("operators/:id/fee/update");
  const isIncreaseRoute = useMatch("operators/:id/fee/increase");

  const context = useUpdateOperatorFeeContext();

  if (isEmptyRoute) return <Navigate to="./update" replace />;

  if (declaredFee.isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full  pb-6">
        <img src="/images/ssv-loader.svg" className="size-36" />
      </div>
    );

  if (
    isDefaultRoute &&
    (status.isWaiting || status.isPendingExecution || status.isExpired)
  )
    return <Navigate to="./increase" replace />;

  if (isIncreaseRoute && status.isDeclaration && !context.newYearlyFee)
    return <Navigate to="./update" replace />;

  return props.children;
};

ProtectedClusterRoute.displayName = "ProtectedOperatorRoute";
