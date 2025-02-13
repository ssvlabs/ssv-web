import { Outlet } from "react-router-dom";
import MyAccount from "@/app/routes/dashboard/b-app/my-account/my-account.tsx";
import Accounts from "@/app/routes/dashboard/b-app/my-account/accounts.tsx";
import { Strategies } from "@/app/routes/dashboard/b-app/strategies/strategies.tsx";
import Strategy from "@/app/routes/dashboard/b-app/strategies/strategy.tsx";
import BApps from "@/app/routes/dashboard/b-app/strategies/b-apps.tsx";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import Fee from "@/app/routes/dashboard/b-app/strategies/fee.tsx";
import Metadata from "@/app/routes/dashboard/b-app/strategies/metadata.tsx";
// import { RegisterOperatorGuard } from "@/guard/register-operator-guards.tsx";
// import { JoinOperatorPreparation } from "@/app/routes/join/operator/join-operator-preparation.tsx";
// import { RegisterOperator } from "@/app/routes/join/operator/register-operator.tsx";
// import { SetOperatorFee } from "@/app/routes/join/operator/set-operator-fee.tsx";
// import { RegisterOperatorConfirmation } from "@/app/routes/join/operator/register-operator-confirmation.tsx";
// import { RegisterOperatorSuccess } from "@/app/routes/join/operator/register-operator-success.tsx";

export const accountRoutes = {
  path: "account",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <MyAccount />,
    },
    {
      path: "accounts",
      element: <Accounts />,
    },
    {
      path: "strategies",
      element: <Outlet />, // Позволяет вложенные маршруты для "strategies"
      children: [
        {
          index: true,
          element: <Strategies />,
        },
        {
          path: ":strategyId",
          element: <Strategy />,
        },
        {
          path: "create",
          element: <Outlet />, // Для вложенных маршрутов "create"
          children: [
            {
              path: "bApps",
              element: <BApps />,
            },
            {
              path: "obligations",
              element: <Obligations />,
            },
            {
              path: "fee",
              element: <Fee />,
            },
            {
              path: "metadata",
              element: <Metadata />,
            },
          ],
        },
      ],
    },
  ],
};
