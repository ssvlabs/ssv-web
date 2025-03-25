import { Outlet } from "react-router-dom";
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
import { BApp } from "@/app/routes/dashboard/b-app/b-apps/b-app";
import Delegations from "@/app/routes/dashboard/b-app/my-account/delegations.tsx";
import MyStrategies from "@/app/routes/dashboard/b-app/my-account/my-strategies.tsx";
import AccountBApps from "@/app/routes/dashboard/b-app/my-account/account-b-apps.tsx";

const strategyRoutes = (generalPath: string) => {
  const Component = generalPath === "my-strategies" ? MyStrategies : Strategies;
  return {
    path: generalPath,
    element: (
      <CreateStrategyGuard>
        <Outlet />
      </CreateStrategyGuard>
    ),
    children: [
      {
        index: true,
        element: <Component />,
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
  };
};

export const accountRoutes = {
  path: "account",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Delegations />,
    },
    {
      index: true,
      path: "my-delegations",
      element: <Delegations />,
    },
    strategyRoutes("my-strategies"),
    {
      path: "my-bApps",
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <AccountBApps />,
        },
        {
          path: ":bAppId",
          element: <BApp />,
        },
      ],
    },
    {
      path: "accounts",
      element: <Accounts />,
    },
    {
      path: "assets",
      element: <Assets />,
    },
    {
      path: "assets/accounts",
      element: <Accounts />,
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
          path: ":bAppId",
          element: <BApp />,
        },
        {
          path: "create",
          element: <CreateBApp />,
        },
      ],
    },
    strategyRoutes("strategies"),
  ],
};
