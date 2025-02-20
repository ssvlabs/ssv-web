import { Outlet } from "react-router-dom";
import MyAccount from "@/app/routes/dashboard/b-app/my-account/my-account.tsx";
import Accounts from "@/app/routes/dashboard/b-app/my-account/accounts.tsx";
import { Strategies } from "@/app/routes/dashboard/b-app/strategies/strategies.tsx";
import Strategy from "@/app/routes/dashboard/b-app/strategies/strategy.tsx";
import SelectBApp from "@/app/routes/dashboard/b-app/strategies/select-b-app.tsx";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import Fee from "@/app/routes/dashboard/b-app/strategies/fee.tsx";
import Metadata from "@/app/routes/dashboard/b-app/strategies/metadata.tsx";
import { CreateStrategyGuard } from "@/guard/create-strategy-context.ts";
import BApps from "@/app/routes/dashboard/b-app/b-apps/b-apps.tsx";
import CreateBApp from "@/app/routes/dashboard/b-app/b-apps/create-b-app.tsx";
import { Assets } from "@/app/routes/dashboard/b-app/assets/assets";

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
      path: ":strategyId",
      element: <Strategy />,
    },
    {
      path: "assets",
      element: <Assets />,
    },
    {
      path: "bApps",
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <BApps />,
        },
        {
          path: "create",
          element: <CreateBApp />,
        },
      ],
    },
    {
      path: "strategies",
      element: (
        <CreateStrategyGuard>
          <Outlet />
        </CreateStrategyGuard>
      ),
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
          element: <Outlet />,
          children: [
            {
              path: "bApps",
              element: <SelectBApp />,
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
