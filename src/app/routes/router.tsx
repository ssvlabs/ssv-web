import { proxy, useSnapshot } from "valtio";
import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { FeeRecipientAddress } from "@/app/routes/dashboard/clusters/fee-recipient-address";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { Redirector } from "@/app/routes/root-redirection";

import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { joinRoutes } from "./router/route-definitions/join-routes";
import { clustersRoutes } from "./router/route-definitions/clusters-routes";
import { operatorsRoutes } from "./router/route-definitions/operators-routes";
import type { RoutePaths, WritableRoutePaths } from "./router/route-types";
import { Maintenance } from "@/app/routes/maintenance";
import { Compliance } from "@/app/routes/compliance";
import { NotFound } from "./not-found";
import { accountRoutes } from "@/app/routes/router/route-definitions/account-routes.tsx";

const routes = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Redirector />,
      },
      {
        path: "fee-recipient",
        element: <FeeRecipientAddress />,
      },
      joinRoutes,
      accountRoutes,
      clustersRoutes,
      operatorsRoutes,
    ],
  },
  {
    path: "/connect",
    element: (
      <DashboardLayout className="p-6">
        <ConnectWallet />
      </DashboardLayout>
    ),
  },
  {
    path: "/compliance",
    element: (
      <DashboardLayout>
        <Compliance />
      </DashboardLayout>
    ),
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
  {
    path: "*",
    element: (
      <DashboardLayout>
        <NotFound />
      </DashboardLayout>
    ),
  },
] as const satisfies RouteObject[];

export type AppRoutePaths = RoutePaths<typeof routes>;
export type AppWritableRoutePaths = WritableRoutePaths<typeof routes>;

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);

export const locationState = proxy({
  current: router.state.location,
  previous: router.state.location,
  history: [router.state.location],
});

router.subscribe((state) => {
  locationState.previous = JSON.parse(JSON.stringify(locationState.current));
  locationState.current = state.location;

  if (state.historyAction === "PUSH") {
    locationState.history.push(state.location);
  } else if (state.historyAction === "POP") {
    locationState.history.pop();
  } else if (state.historyAction === "REPLACE") {
    locationState.history[locationState.history.length - 1] = state.location;
  }
});

export const useLocationState = () => {
  return useSnapshot(locationState);
};
