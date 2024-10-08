import { Loading } from "@/components/ui/Loading";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedClusterRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash ?? "");

  if (isUndefined(clusterHash)) return <Navigate to="/clusters" />;
  if (cluster.isLoading) return <Loading />;
  if (cluster.isError || !cluster.data) return <Navigate to="/clusters" />;

  return props.children;
};

ProtectedClusterRoute.displayName = "ProtectedOperatorRoute";
