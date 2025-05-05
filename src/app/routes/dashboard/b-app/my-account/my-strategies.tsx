import { Text } from "@/components/ui/text.tsx";
import { Container } from "@/components/ui/container.tsx";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { currencyFormatter, formatSSV } from "@/lib/utils/number.ts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { isAddress } from "viem";
import { shortenAddress } from "@/lib/utils/strings.ts";
import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import MyAccountWrapper from "@/app/routes/dashboard/b-app/my-account/my-account-wrapper.tsx";
import { AccountSelect } from "@/app/routes/dashboard/b-app/my-account/my-account-wrapper.tsx";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";
import { FaInfoCircle } from "react-icons/fa";
import { MyStrategiesTable } from "@/components/based-apps/my-strategies-table/my-strategies-table.tsx";

const MyStrategies = () => {
  const { myStrategies, myAccountData } = useMyBAppAccount();
  const MOCK_TIER_DATA = [
    {
      label: "Delegators",
      value: myStrategies.totalDelegators,
      tooltipText:
        "Total number of accounts that have delegated to your account",
    },
    {
      label: "Delegated Validator Balance",
      value: (
        <div className="flex gap-2">
          {formatSSV(myStrategies.totalDelegatedValue || 0n)}
          <img
            className={"h-[24px] w-[15px]"}
            src={`/images/balance-validator/balance-validator.svg`}
          />
          <Text className="text-gray-500 font-medium">ETH</Text>
        </div>
      ),
      tooltipText:
        "Total effective balance (ETH) of all validators delegated to your account",
    },
    {
      label: "Total Deposited Value",
      value: currencyFormatter.format(Number(myStrategies.totalDepositedFiat)),
      tooltipText: "Total value of all deposits made to all of your strategies",
    },
    {
      label: "Total Asset Value",
      value: currencyFormatter.format(Number(myStrategies.totalAssetsFiat)),
      tooltipText:
        "Combined value of all deposits and delegations made to your account and all of your strategies",
    },
    {
      label: "Account",
      value: (
        <div className="flex items-center gap-2 text-nowrap">
          <img
            className="rounded-[8px] size-7 border-gray-400 border"
            src={
              myAccountData?.logo ||
              "/images/operator_default_background/light.svg"
            }
            onError={(e) => {
              e.currentTarget.src =
                "/images/operator_default_background/light.svg";
            }}
          />
          <Text className="w-[120px] overflow-x-hidden text-ellipsis">
            {myAccountData?.name
              ? isAddress(myAccountData?.name)
                ? shortenAddress(myAccountData?.name)
                : myAccountData?.name
              : shortenAddress(myAccountData?.id || "0x")}
          </Text>
          <Tooltip
            content={`Copy Address: ${shortenAddress(myAccountData?.id || "0x")}`}
          >
            <div className="flex items-center justify-center">
              <CopyBtn text={myAccountData?.id} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <MyAccountWrapper filter={AccountSelect.Strategy}>
      <Container variant="vertical" size="xl" className="py-6">
        <div className="h-[100px] w-full flex items-center gap-10 rounded-[16px] bg-white p-6">
          {MOCK_TIER_DATA.map(({ label, value, tooltipText }) => (
            <div className="w-[288px] flex-col items-center gap-1">
              <div className="flex ">
                <Tooltip asChild className="max-w-max" content={tooltipText}>
                  <div className="flex items-center gap-1">
                    <Text className="text-gray-500" variant={"caption-medium"}>
                      {label}
                    </Text>{" "}
                    {!!tooltipText && (
                      <FaInfoCircle className="text-gray-500 size-3" />
                    )}
                  </div>
                </Tooltip>
              </div>
              <Text variant={"body-1-medium"}>{value as string}</Text>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-between">
          <Text variant="body-1-semibold">My Strategies</Text>
          <Button as={Link} to={"create/bApps"} size="sm" className="px-5 h-10">
            Create Strategy
          </Button>
        </div>
        <MyStrategiesTable
          strategies={
            myStrategies.strategies as (Strategy &
              StrategyMetadata & { ownerAddressMetadata: AccountMetadata })[]
          }
        />
      </Container>
    </MyAccountWrapper>
  );
};

export default MyStrategies;
