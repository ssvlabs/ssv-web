import { locationState } from "@/app/routes/router";
import { Loading } from "@/components/ui/Loading";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";
import { Navigate } from "react-router";

export const Redirector = () => {
  const {
    isNewAccount,
    isLoadingClusters,
    isLoadingOperators,
    hasClusters,
    hasOperators,
  } = useIsNewAccount();

  const referral =
    locationState.previous.pathname + locationState.previous.search;

  const clusterMatch = referral.match(/clusters/);
  const operatorMatch = referral.match(/operators/);

  if (isLoadingClusters) return <Loading />;
  if (clusterMatch && hasClusters) return <Navigate to={referral} replace />;

  if (isLoadingOperators) return <Loading />;
  if (operatorMatch && hasOperators) return <Navigate to={referral} replace />;

  if (hasClusters) return <Navigate to={"/clusters"} replace />;
  if (hasOperators) return <Navigate to={"/operators"} replace />;

  if (isNewAccount) return <Navigate to="/join" replace />;

  return <Navigate to="/clusters" />;
};
