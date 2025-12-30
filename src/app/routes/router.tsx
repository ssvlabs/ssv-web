import { DashboardLayout } from "@/app/layouts/dashboard/dashboard";
import { ConnectWallet } from "@/app/routes/connect-wallet/connect-wallet";
import { FeeRecipientAddress } from "@/app/routes/dashboard/clusters/fee-recipient-address";
import { ProtectedRoute } from "@/app/routes/protected-route";
import { Redirector } from "@/app/routes/root-redirection";
import { proxy, useSnapshot } from "valtio";

import { Compliance } from "@/app/routes/compliance";
import { Maintenance } from "@/app/routes/maintenance";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { NotFound } from "./not-found";
import { clustersRoutes } from "./router/route-definitions/clusters-routes";
import { joinRoutes } from "./router/route-definitions/join-routes";
import { operatorsRoutes } from "./router/route-definitions/operators-routes";
import { SwitchWizardStepOneRoute } from "./switch-wizard/switch-wizard-step-one";
import { SwitchWizardStepOneAndHalfRoute } from "./switch-wizard/switch-wizard-step-one-and-half";
import { SwitchWizardStepTwoRoute } from "./switch-wizard/switch-wizard-step-two";
import { SwitchWizardStepThreeRoute } from "./switch-wizard/switch-wizard-step-three";
import { SwitchWizardStepFourRoute } from "./switch-wizard/switch-wizard-step-four";
import type { RoutePaths, WritableRoutePaths } from "./router/route-types";

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
      {
        path: "switch-wizard/:clusterHash",
        element: <SwitchWizardStepOneRoute />,
      },
      {
        path: "switch-wizard/:clusterHash/step-one",
        element: <SwitchWizardStepOneAndHalfRoute />,
      },
      {
        path: "switch-wizard/:clusterHash/step-two",
        element: <SwitchWizardStepTwoRoute />,
      },
      {
        path: "switch-wizard/:clusterHash/step-three",
        element: <SwitchWizardStepThreeRoute />,
      },
      {
        path: "switch-wizard/:clusterHash/step-four",
        element: <SwitchWizardStepFourRoute />,
      },
      joinRoutes,
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
