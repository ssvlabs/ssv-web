import type { FC } from "react";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { Cluster } from "./cluster";
import { MigratedCluster } from "./migrated/migrated-cluster";

export const ClusterPageResolver: FC = () => {
  const cluster = useCluster();

  if (cluster.data?.migrated) return <MigratedCluster />;

  return <Cluster />;
};

ClusterPageResolver.displayName = "ClusterPageResolver";
