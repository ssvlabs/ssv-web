import { Outlet } from "react-router-dom";
import MyAccount from "@/app/routes/dashboard/my-account/my-account.tsx";
import Accounts from "@/app/routes/dashboard/my-account/accounts.tsx";
import { Strategies } from "@/app/routes/dashboard/my-account/strategies";

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
  ],
};
