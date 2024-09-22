import { Outlet } from "react-router-dom";
import { Clusters } from "@/app/routes/dashboard/clusters/clusters";
import { Cluster } from "@/app/routes/dashboard/clusters/cluster/cluster";
import { WithdrawClusterBalance } from "@/app/routes/dashboard/clusters/cluster/withdraw-cluster-balance";
import { DepositClusterBalance } from "@/app/routes/dashboard/clusters/cluster/deposit-cluster-balance";
import { ReactivateCluster } from "@/app/routes/create-cluster/reactivate";
import { ProtectedClusterRoute } from "@/app/routes/protected-cluster-route";
import { BulkActionGuard } from "@/guard/bulk-action-guard";
import { Bulk } from "@/app/routes/dashboard/clusters/cluster/bulk";
import { RemoveValidatorsConfirmation } from "@/app/routes/dashboard/clusters/cluster/remove-validators-confirmation";
import { ExitValidatorsConfirmation } from "@/app/routes/dashboard/clusters/cluster/exit-validators-confirmation";
import { ExitValidatorsSuccess } from "@/app/routes/dashboard/clusters/cluster/exit-validators-success";

export const clustersRoutes = {
  path: "clusters",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Clusters />,
    },
    {
      path: ":clusterHash",
      element: (
        <ProtectedClusterRoute>
          <Outlet />
        </ProtectedClusterRoute>
      ),
      children: [
        {
          index: true,
          element: <Cluster />,
        },
        {
          path: "withdraw",
          element: <WithdrawClusterBalance />,
        },
        {
          path: "deposit",
          element: <DepositClusterBalance />,
        },
        {
          path: "reactivate",
          element: <ReactivateCluster />,
        },
        {
          path: "remove",
          element: (
            <BulkActionGuard>
              <Outlet />
            </BulkActionGuard>
          ),
          children: [
            {
              index: true,
              element: <Bulk type="remove" />,
            },
            {
              path: "confirmation",
              element: <RemoveValidatorsConfirmation />,
            },
          ],
        },
        {
          path: "exit",
          element: (
            <BulkActionGuard>
              <Outlet />
            </BulkActionGuard>
          ),
          children: [
            {
              index: true,
              element: <Bulk type="exit" />,
            },
            {
              path: "confirmation",
              element: <ExitValidatorsConfirmation />,
            },
            {
              path: "success",
              element: <ExitValidatorsSuccess />,
            },
          ],
        },
      ],
    },
  ],
};
