import { Outlet } from "react-router-dom";
import { Operators } from "@/app/routes/dashboard/operators/operators";
import { Operator } from "@/app/routes/dashboard/operators/operator";
import { OperatorSettings } from "@/app/routes/dashboard/operators/operator-settings/operator-settings";
import { ProtectedOperatorRoute } from "@/app/routes/protected-operator-route";
import { AuthorizedAddresses } from "@/app/routes/dashboard/operators/operator-settings/authorized-addresses";
import { OperatorStatus } from "@/app/routes/dashboard/operators/operator-settings/operator-status";
import ExternalContract from "@/app/routes/dashboard/operators/operator-settings/external-contract";
import { ProtectedOperatorUpdateFeeRoute } from "@/app/routes/dashboard/operators/update-fee/protected-operator-update-fee-route";
import { UpdateOperatorFee } from "@/app/routes/dashboard/operators/update-fee/update-operator-fee";
import { DecreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/decrease-operator-fee";
import { IncreaseOperatorFee } from "@/app/routes/dashboard/operators/update-fee/increase-operator-fee";
import { OperatorFeeUpdated } from "@/app/routes/dashboard/operators/update-fee/operator-fee-updated";
import { WithdrawOperatorBalance } from "@/app/routes/dashboard/operators/withdraw-operator-balance";
import { OperatorMetadata } from "@/app/routes/dashboard/operators/operator-settings/operator-metadata";
import { RemoveOperator } from "@/app/routes/dashboard/operators/remove-operator";
import { OperatorNotFound } from "@/app/routes/dashboard/operators/operator-not-found";
import { NoYourOperator } from "@/app/routes/dashboard/operators/no-your-operator";

export const operatorsRoutes = {
  path: "operators",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Operators />,
    },
    {
      path: ":operatorId",
      element: (
        <ProtectedOperatorRoute>
          <Outlet />
        </ProtectedOperatorRoute>
      ),
      children: [
        {
          index: true,
          element: <Operator />,
        },
        {
          path: "settings",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <OperatorSettings />,
            },
            {
              path: "authorized-addresses",
              element: <AuthorizedAddresses />,
            },
            {
              path: "status",
              element: <OperatorStatus />,
            },
            {
              path: "external-contract",
              element: <ExternalContract />,
            },
          ],
        },
        {
          path: "fee",
          element: (
            <ProtectedOperatorUpdateFeeRoute>
              <Outlet />
            </ProtectedOperatorUpdateFeeRoute>
          ),
          children: [
            {
              path: "update",
              element: <UpdateOperatorFee />,
            },
            {
              path: "decrease",
              element: <DecreaseOperatorFee />,
            },
            {
              path: "increase",
              element: <IncreaseOperatorFee />,
            },
            {
              path: "success",
              element: <OperatorFeeUpdated />,
            },
          ],
        },
        {
          path: "withdraw",
          element: <WithdrawOperatorBalance />,
        },
        {
          path: "details",
          element: <OperatorMetadata />,
        },
        {
          path: "remove",
          element: <RemoveOperator />,
        },
      ],
    },
    {
      path: "not-found",
      element: <OperatorNotFound />,
    },
    {
      path: "not-your-operator",
      element: <NoYourOperator />,
    },
  ],
};
