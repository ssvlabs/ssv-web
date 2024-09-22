import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const account = useAccount();

  if (!account.isConnected) return <Navigate to="/connect" replace />;

  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
