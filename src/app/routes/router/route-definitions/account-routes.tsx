import { Outlet } from "react-router-dom";
import MyAccount from "@/app/routes/dashboard/my-account/my-account.tsx";
import Accounts from "@/app/routes/dashboard/my-account/accounts.tsx";

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
  ],
};
