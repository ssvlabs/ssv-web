import type { FC, ComponentPropsWithoutRef } from "react";
import { DashboardPicker } from "@/components/dashboard/dashboard-picker";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Container } from "@/components/ui/container";
import { Link, useNavigate } from "react-router-dom";
import { Spacer } from "@/components/ui/spacer";
import { FiEdit3 } from "react-icons/fi";
import { ClusterTable } from "@/components/validator/clusters-table/clusters-table";
import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";
import { useIsNewAccount } from "@/hooks/account/use-is-new-account";

export const Clusters: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { clusters, pagination, query } = usePaginatedAccountClusters();
  const navigate = useNavigate();
  const { hasClusters } = useIsNewAccount();

  return (
    <>
      <Helmet>
        <title>SSV My Clusters</title>
      </Helmet>

      <Container variant="vertical" size="xl" className="py-6">
        <div className="flex justify-between w-full gap-3">
          <DashboardPicker />
          <Spacer />
          <Button
            size="lg"
            variant="secondary"
            as={Link}
            to="/fee-recipient"
            disabled={!hasClusters}
          >
            Fee Address <FiEdit3 />
          </Button>
          <Button size="lg" className="px-10" as={Link} to="/join/validator">
            Add Cluster
          </Button>
        </div>
        <ClusterTable
          clusters={clusters}
          pagination={pagination}
          isLoading={query.isPending}
          isEmpty={query.isSuccess && pagination.total === 0}
          onClusterClick={(cluster) => navigate(cluster.clusterId)}
        />
      </Container>
    </>
  );
};

Clusters.displayName = "Clusters";
