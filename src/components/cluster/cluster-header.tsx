import { CopyBtn } from "@/components/ui/copy-btn";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { formatEffectiveBalance } from "@/lib/utils/number";
import { shortenClusterId } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export type ClusterHeaderProps = ComponentPropsWithoutRef<"div"> & {
  backRoutePath?: string;
  backButtonLabel?: string;
};

export const ClusterHeader: FC<ClusterHeaderProps> = ({
  className,
  backRoutePath = "/clusters",
  backButtonLabel = "Cluster Details",
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const { cluster, effectiveBalance } = useClusterState(clusterHash!, {
    effectiveBalance: { watch: true },
  });

  const clusterId = cluster.data?.clusterId || "";
  const validatorCount = cluster.data?.validatorCount || 0;
  // effectiveBalance.data is a number in ETH units, convert to bigint for formatting
  const totalEffectiveBalance = effectiveBalance.data
    ? BigInt(Math.floor(effectiveBalance.data))
    : cluster.data?.effectiveBalance
      ? BigInt(cluster.data.effectiveBalance)
      : 0n;

  const isLoading = cluster.isLoading || effectiveBalance.isLoading;

  return (
    <div className={cn("w-full bg-gray-100", className)} {...props}>
      {/* Container for content */}
      <div className="mx-auto max-w-[1320px] px-5">
        {/* Back Button Section */}
        <div className="h-[60px] py-3.5">
          <Link
            to={backRoutePath}
            className={cn("flex items-center gap-3 cursor-pointer", className)}
          >
            <FaAngleLeft className="text-primary-500" />
            <Text variant="body-1-bold">{backButtonLabel}</Text>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="flex items-start gap-40 py-6">
          {/* ID Stat */}
          <div className="flex flex-col gap-2">
            <Text variant="caption-medium" className="text-gray-500">
              ID
            </Text>
            <div className="flex items-center gap-1">
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <>
                  <Text
                    variant="body-3-medium"
                    className="font-robotoMono text-gray-700"
                  >
                    {shortenClusterId(clusterId)}
                  </Text>
                  <CopyBtn text={clusterId} />
                </>
              )}
            </div>
          </div>

          {/* Validators Stat */}
          <div className="flex flex-col gap-2">
            <Text variant="caption-medium" className="text-gray-500">
              Validators
            </Text>
            <div className="flex items-center">
              {isLoading ? (
                <Skeleton className="h-5 w-8" />
              ) : (
                <Text variant="body-3-medium" className="text-gray-800">
                  {validatorCount.toString()}
                </Text>
              )}
            </div>
          </div>

          {/* Total Effective Balance Stat */}
          <div className="flex flex-col gap-2">
            <Text variant="caption-medium" className="text-gray-500">
              Total Effective Balance
            </Text>
            <div className="flex items-center gap-1">
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <>
                  <img
                    src="/images/networks/dark.svg"
                    className="size-5"
                    alt="ETH"
                  />
                  <Text variant="body-3-medium">
                    {formatEffectiveBalance(totalEffectiveBalance)} ETH
                  </Text>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ClusterHeader.displayName = "ClusterHeader";
