import type { FC } from "react";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useOperators } from "@/hooks/operator/use-operators";
import { ClusterOperatorsTable } from "./cluster-operators-table";

export const ClusterOperatorsTablePage: FC = () => {
  const cluster = useCluster();
  const { data: operators = [] } = useOperators(cluster.data?.operators ?? []);

  return <ClusterOperatorsTable operators={operators} />;
};

ClusterOperatorsTablePage.displayName = "ClusterOperatorsTablePage";
