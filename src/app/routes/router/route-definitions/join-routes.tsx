import { Outlet } from "react-router-dom";
import { Join } from "@/app/routes/join/join";
import { Launchpad } from "@/app/routes/create-cluster/launchpad";
import { JoinOperatorPreparation } from "@/app/routes/join/operator/join-operator-preparation";
import { RegisterOperator } from "@/app/routes/join/operator/register-operator";
import { SetOperatorFee } from "@/app/routes/join/operator/set-operator-fee";
import { RegisterOperatorConfirmation } from "@/app/routes/join/operator/register-operator-confirmation";
import { RegisterOperatorSuccess } from "@/app/routes/join/operator/register-operator-success";
import { RegisterOperatorGuard } from "@/guard/register-operator-guards";
import { RegisterValidatorGuard } from "@/guard/register-validator-guard";
import { DistributionMethod } from "@/app/routes/create-cluster/distribution-method";
import { GenerateKeySharesOnline } from "@/app/routes/create-cluster/generate-key-shares-online";
import { DistributeOffline } from "@/app/routes/create-cluster/distribute-offline";
import { DKGCeremonySummary } from "@/app/routes/create-cluster/dkg-ceremony-summary";
import { UploadKeyshares } from "@/app/routes/create-cluster/upload-keyshares";
import { AdditionalFunding } from "@/app/routes/create-cluster/additional-funding";
import { BalanceWarning } from "@/app/routes/create-cluster/balance-warning";
import { SlashingWarning } from "@/app/routes/create-cluster/slashing-warning";
import { RegisterValidatorConfirmation } from "@/app/routes/create-cluster/register-validator-confirmation";
import { RegisterValidatorSuccess } from "@/app/routes/create-cluster/register-validator-success";
import { Preparation } from "@/app/routes/create-cluster/preparation";
import { SelectOperators } from "@/app/routes/create-cluster/select-operators";
import { InitialFunding } from "@/app/routes/create-cluster/initial-funding";

export const joinRoutes = {
  path: "join",
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Join />,
    },
    {
      path: "launchpad",
      element: <Launchpad />,
    },
    {
      path: "operator",
      element: (
        <RegisterOperatorGuard>
          <Outlet />
        </RegisterOperatorGuard>
      ),
      children: [
        {
          index: true,
          element: <JoinOperatorPreparation />,
        },
        {
          path: "register",
          element: <RegisterOperator />,
        },
        {
          path: "fee",
          element: <SetOperatorFee />,
        },
        {
          path: "confirm-transaction",
          element: <RegisterOperatorConfirmation />,
        },
        {
          path: "success",
          element: <RegisterOperatorSuccess />,
        },
      ],
    },
    {
      path: "validator",
      element: (
        <RegisterValidatorGuard>
          <Outlet />
        </RegisterValidatorGuard>
      ),
      children: [
        {
          path: ":clusterHash",
          element: <Outlet />,
          children: [
            {
              path: "distribution-method",
              element: <DistributionMethod variant="add" />,
            },
            {
              path: "online",
              element: <GenerateKeySharesOnline />,
            },
            {
              path: "offline",
              element: <DistributeOffline />,
            },
            {
              path: "ceremony-summary",
              element: <DKGCeremonySummary />,
            },
            {
              path: "keyshares",
              element: <UploadKeyshares />,
            },
            {
              path: "funding",
              element: <AdditionalFunding />,
            },
            {
              path: "balance-warning",
              element: <BalanceWarning />,
            },
            {
              path: "slashing-warning",
              element: <SlashingWarning />,
            },
            {
              path: "confirmation",
              element: <RegisterValidatorConfirmation />,
            },
            {
              path: "success",
              element: <RegisterValidatorSuccess />,
            },
          ],
        },
        {
          index: true,
          element: <Preparation />,
        },
        {
          path: "select-operators",
          element: <SelectOperators />,
        },
        {
          path: "distribution-method",
          element: <DistributionMethod variant="create" />,
        },
        {
          path: "keyshares",
          element: <UploadKeyshares />,
        },
        {
          path: "online",
          element: <GenerateKeySharesOnline />,
        },
        {
          path: "offline",
          element: <DistributeOffline />,
        },
        {
          path: "ceremony-summary",
          element: <DKGCeremonySummary />,
        },
        {
          path: "funding",
          element: <InitialFunding />,
        },
        {
          path: "balance-warning",
          element: <BalanceWarning />,
        },
        {
          path: "slashing-warning",
          element: <SlashingWarning />,
        },
        {
          path: "confirmation",
          element: <RegisterValidatorConfirmation />,
        },
        {
          path: "success",
          element: <RegisterValidatorSuccess />,
        },
      ],
    },
  ],
};
