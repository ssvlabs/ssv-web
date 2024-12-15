import { Loading } from "@/components/ui/Loading";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { isUndefined } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Navigate } from "react-router-dom";
import { isFrom } from "@/lib/utils/router.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";

export const ProtectedClusterRoute: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash ?? "");
  const { resetState } = useBulkActionContext;

  if (isUndefined(clusterHash)) return <Navigate to="/clusters" />;
  if (cluster.isLoading) return <Loading />;
  if (cluster.isError || !cluster.data) return <Navigate to="/clusters" />;
  if (isFrom("/clusters/:clusterHash")) resetState();

  return props.children;
};

ProtectedClusterRoute.displayName = "ProtectedOperatorRoute";
