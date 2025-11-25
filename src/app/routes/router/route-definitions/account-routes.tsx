import { Outlet } from "react-router-dom";
import { DelegateProvider } from "@/components/context/delegate-context.tsx";

const strategyRoutes = (generalPath: string) => {
  return {
    path: generalPath,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <div>Strategies removed</div>,
      },
    ],
  };
};

export const accountRoutes = {
  path: "account",
  element: (
    <DelegateProvider>
      <Outlet />
    </DelegateProvider>
  ),
  children: [
    {
      index: true,
      element: <div>Account removed</div>,
    },
    strategyRoutes("strategies"),
  ],
};