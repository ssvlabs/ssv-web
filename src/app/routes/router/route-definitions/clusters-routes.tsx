import { Outlet } from "react-router-dom";
import { Clusters } from "@/app/routes/dashboard/clusters/clusters";
import { WithdrawClusterBalance } from "@/app/routes/dashboard/clusters/cluster/withdraw-cluster-balance";
import { DepositClusterBalance } from "@/app/routes/dashboard/clusters/cluster/deposit-cluster-balance";
import ReactivateEffectiveBalance from "@/app/routes/create-cluster/reactivate-effective-balance";
import { ReactivateCluster } from "@/app/routes/create-cluster/reactivate";
import { ProtectedClusterRoute } from "@/app/routes/protected-cluster-route";
import { BulkActionGuard } from "@/guard/bulk-action-guard";
import { Bulk } from "@/app/routes/dashboard/clusters/cluster/bulk";
import { RemoveValidatorsConfirmation } from "@/app/routes/dashboard/clusters/cluster/remove-validators-confirmation";
import { ExitValidatorsConfirmation } from "@/app/routes/dashboard/clusters/cluster/exit-validators-confirmation";
import { ExitValidatorsSuccess } from "@/app/routes/dashboard/clusters/cluster/exit-validators-success";
import UploadProofs from "@/app/routes/reshare-dkg/upload-proofs.tsx";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
import Reshare from "@/app/routes/reshare-dkg/reshare.tsx";
import { ClusterPageResolver } from "@/app/routes/dashboard/clusters/cluster/cluster-page-resolver";
import { ClusterValidatorsList } from "@/components/cluster/cluster-validators-list";
import { ClusterOperatorsTablePage } from "@/app/routes/dashboard/clusters/cluster/migrated/cluster-operators-table-page";

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
          element: <ClusterPageResolver />,
          children: [
            {
              index: true,
              element: <ClusterValidatorsList className="min-h-96" />,
            },
            {
              path: "operators",
              element: <ClusterOperatorsTablePage />,
            },
          ],
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
          path: "reactivate-balance",
          element: <ReactivateEffectiveBalance />,
        },
        {
          path: "reactivate",
          element: <ReactivateCluster />,
        },
        {
          path: "reshare",
          element: <UploadProofs />,
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
            {
              path: ":publicKeys",
              element: <Bulk type="remove" />,
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
        {
          path: "reshare",
          element: (
            <BulkActionGuard>
              <Outlet />
            </BulkActionGuard>
          ),
          children: [
            {
              path: "select-operators",
              element: <SelectOperators />,
            },
            {
              path: "summary",
              element: <Reshare />,
            },
          ],
        },
      ],
    },
  ],
};
