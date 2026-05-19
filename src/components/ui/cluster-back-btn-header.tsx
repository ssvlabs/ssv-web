import { Text } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";

export const ClusterBackBtnHeader = () => {
  const { clusterHash } = useClusterPageParams();

  return (
    <div data-testid="cluster-back-btn-header" className="flex gap-4">
      Cluster {shortenAddress((clusterHash || "").slice(2) || "", 4, 4)}
      <div className="h-6 w-[1px] bg-gray-400" />
      <Text
        data-testid="cluster-back-btn-header-cluster-hash"
        className="text-gray-700 font-medium flex items-center gap-4"
      >
        {shortenAddress((clusterHash || "").slice(2) || "", 4, 4)}
        <CopyBtn
          data-testid="cluster-back-btn-header-copy-cluster-hash-btn"
          isFullSizeIcon
          text={clusterHash}
          className="bg-transparent text-[24px] size-[24px] p-0"
        />
      </Text>
    </div>
  );
};
