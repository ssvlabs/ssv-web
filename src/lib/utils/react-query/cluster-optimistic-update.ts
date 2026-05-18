import type { AllEvents } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";
import { setOptimisticData } from "@/lib/react-query";
import { mergeClusterSnapshot } from "@/lib/utils/cluster";
import type { SolidityCluster } from "@/types/api";
import { SetterABI } from "@/lib/abi/setter";
import type { AbiEvent } from "abitype";

type ClusterEvent = Extract<AllEvents, { args: { cluster: SolidityCluster } }>;
type ClusterEventName = ClusterEvent["eventName"];

const CLUSTER_EVENT_NAMES = new Set<ClusterEventName>(
  (
    SetterABI.filter(
      (e) =>
        e.type === "event" &&
        e.inputs.some(
          (i) => i.internalType === "struct ISSVNetworkCore.Cluster",
        ),
    ) as AbiEvent[]
  ).map((e) => e.name) as ClusterEventName[],
);

const findClusterEvent = (events: AllEvents[]): ClusterEvent | undefined =>
  events.find((e): e is ClusterEvent =>
    CLUSTER_EVENT_NAMES.has(e.eventName as ClusterEventName),
  );

const resolveLiquidationState = (events: AllEvents[]) => {
  if (events.find((e) => e.eventName === "ClusterLiquidated"))
    return { isLiquidated: true };

  if (events.find((e) => e.eventName === "ClusterReactivated"))
    return { isLiquidated: false };
};

export const applyOptimisticClusterUpdate = (
  clusterHash: string,
  events: AllEvents[],
) => {
  const event = findClusterEvent(events);
  if (!event) return;

  setOptimisticData(getClusterQueryOptions(clusterHash).queryKey, (cluster) => {
    if (!cluster) return cluster;
    return mergeClusterSnapshot(
      cluster,
      event.args.cluster,
      resolveLiquidationState(events),
    );
  });
};
