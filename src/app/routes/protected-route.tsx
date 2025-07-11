import { useAccount } from "@/hooks/account/use-account";
import { useCompliance } from "@/hooks/app/use-compliance";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const account = useAccount();
  const compliance = useCompliance();

  if (!account.isConnected) return <Navigate to="/connect" replace />;
  if (compliance.data) {
    return <Navigate to="/compliance" replace />;
  }

  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
