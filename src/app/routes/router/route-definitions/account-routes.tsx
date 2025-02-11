import { Outlet } from "react-router-dom";
import MyAccount from "@/app/routes/dashboard/b-app/my-account/my-account.tsx";
import Accounts from "@/app/routes/dashboard/b-app/my-account/accounts.tsx";
import { Strategies } from "@/app/routes/dashboard/b-app/strategies/strategies.tsx";
import Create from "@/app/routes/dashboard/b-app/strategies/create.tsx";

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
      element: <Strategies />,
    },
    {
      path: "strategies/create",
      element: <Create />,
    },
  ],
};
