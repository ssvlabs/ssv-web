import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { Redirector } from "@/app/routes/root-redirection";

import { Compliance } from "@/app/routes/compliance";
import { Maintenance } from "@/app/routes/maintenance";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { NotFound } from "./not-found";
import { Request } from "@/app/routes/request";
import { Success } from "@/app/routes/success";
import { Depleted } from "@/app/routes/depleted";
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
        path: "request",
        element: <Request />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "depleted",
        element: <Depleted />,
      },
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

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);
