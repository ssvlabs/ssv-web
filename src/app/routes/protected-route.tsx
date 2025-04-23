import { useAccount } from "@/hooks/account/use-account";
import { useCompliance } from "@/hooks/app/use-compliance";
import type { ComponentPropsWithoutRef, FC } from "react";
import { matchPath, Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const location = useLocation();

  const account = useAccount();

  const compliance = useCompliance();

  if (!account.isConnected) return <Navigate to="/connect" replace />;
  if (compliance.data) {
    return <Navigate to="/compliance" replace />;
  }

  const isTestnet = account.chain?.testnet;
  const match = Boolean(matchPath("/account/*", location.pathname));
  const shouldRedirectToRoot = Boolean(!isTestnet && match);

  if (shouldRedirectToRoot) {
    return <Navigate to="/" replace />;
  }

  return props.children;
};

ProtectedRoute.displayName = "ProtectedRoute";
