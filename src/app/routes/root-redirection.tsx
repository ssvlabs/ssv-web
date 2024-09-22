import { locationState } from "@/app/routes/router";
import { Loading } from "@/components/ui/Loading";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";
import { Navigate } from "react-router";

export const Redirector = () => {
  const {
    isLoading,
    isNewAccount,
    clusters,
    operators,
    hasClusters,
    hasOperators,
  } = useIsNewAccount();

  const referral =
    locationState.previous.pathname + locationState.previous.search;

  const clusterMatch = referral.match(/clusters/);
  const operatorMatch = referral.match(/operators/);

  if (clusters.query.isLoading) return <Loading />;

  if (clusterMatch && clusters.query.isSuccess && hasClusters)
    return <Navigate to={referral} replace />;

  if (
    operatorMatch &&
    clusters.query.isSuccess &&
    operators.query.isSuccess &&
    hasOperators
  )
    return <Navigate to={referral} replace />;

  if (clusters.query.isSuccess && hasClusters)
    return <Navigate to={"/clusters"} replace />;

  if (operators.query.isSuccess && hasOperators)
    return <Navigate to={"/operators"} replace />;

  if (isLoading) return <Loading />;
  if (isNewAccount) return <Navigate to="/join" replace />;

  return <Navigate to="/clusters" />;
};
