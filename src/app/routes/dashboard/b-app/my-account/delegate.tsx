import { Text } from "@/components/ui/text.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import Slider from "@/components/ui/custom-slider";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { ethFormatter, formatSSV } from "@/lib/utils/number.ts";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx";
import { useDelegateBalance } from "@/lib/contract-interactions/b-app/write/use-delegate-balance.ts";
import { formatUnits } from "viem";
import { useUpdateDelegatedBalance } from "@/lib/contract-interactions/b-app/write/use-update-delegated-balance.ts";
import { useRemoveDelegatedBalance } from "@/lib/contract-interactions/b-app/write/use-remove-delegated-balance.ts";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise.ts";
import { queryClient } from "@/lib/react-query.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { getNonSlashableAssets } from "@/api/b-app.ts";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { numberFormatLimiter } from "@/lib/utils/number-input";
import { useDelegateContext } from "@/components/context/delegate-context.tsx";
import { track } from "@/lib/analytics/mixpanel";

const Delegate = ({
  closeDelegatePopUp,
  isUpdateFlow,
}: {
  isUpdateFlow?: boolean;
  closeDelegatePopUp: () => void;
}) => {
  const { name, logo, percentage, delegateAddress, delegatedValue } =
    useDelegateContext();
  const delegatedPercentage = percentage
    ? Number(formatUnits(BigInt(percentage), 2))
    : 0;
  const [delegatePercent, setDelegatePercent] =
    useState<number>(delegatedPercentage);
  const { effectiveBalance, restBalancePercentage } = useMyBAppAccount();
  const delegateBalance = useDelegateBalance();
  const updateDelegatedBalance = useUpdateDelegatedBalance();
  const removeDelegatedBalance = useRemoveDelegatedBalance();
  const isPending =
    delegateBalance.isPending ||
    updateDelegatedBalance.isPending ||
    removeDelegatedBalance.isPending;
  const navigate = useNavigate();
  const contractInteractionsToMap = {
    ["delegate"]: {
      func: delegateBalance,
      event: "Delegate Validator Balance",
    },
    ["update"]: {
      func: updateDelegatedBalance,
      event: "Update delegation",
    },
    ["remove"]: {
      func: removeDelegatedBalance,
      event: "Remove delegation",
    },
  };

  const account = useAccount();
  const delegate = async () => {
    const cleanedNumber = Math.round(delegatePercent * 100);

    const contractInteraction =
      isUpdateFlow && delegatePercent === 0
        ? contractInteractionsToMap["remove"]
        : isUpdateFlow
          ? contractInteractionsToMap["update"]
          : contractInteractionsToMap["delegate"];
    const options = withTransactionModal({
      onMined: async () => {
        await retryPromiseUntilSuccess(() =>
          getNonSlashableAssets(account.address!)
            .then((asset) => {
              return isUpdateFlow && delegatePercent === 0
                ? !asset.delegations.some(
                    ({ receiver }) => receiver.id === delegateAddress,
                  )
                : isUpdateFlow
                  ? asset.delegations.some(
                      ({ percentage }) =>
                        Number(percentage) === Number(cleanedNumber),
                    )
                  : asset.delegations.some(
                      ({ receiver }) => receiver.id === delegateAddress,
                    );
            })
            .catch(() => false),
        );

        await queryClient.refetchQueries({
          queryKey: ["non-slashable-assets", account.address],
        });
        track(contractInteraction.event);
        closeDelegatePopUp();
        setTimeout(() => {
          navigate(`/account/my-delegations`);
        }, 100);
      },
    });
    await contractInteraction.func.write(
      {
        receiver: delegateAddress as `0x${string}`,
        percentage: cleanedNumber,
      },
      options,
    );
  };

  const maxValue = restBalancePercentage + delegatedPercentage;
  return (
    <div
      style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="w-[648px] relative rounded-lg shadow-lg bg-background p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between items-center">
              <Text className="font-bold text-xl">
                Validator Balance Delegation
              </Text>
              <button
                onClick={closeDelegatePopUp}
                className="text-gray-600 hover:text-gray-800"
              >
                &#10005;
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                Delegating to
              </Text>
              <div className="flex items-center gap-1.5 px-6 py-4 rounded-[12px] bg-gray-100">
                <img
                  className="w-7 rounded-[8px] border-gray-400 border"
                  src={logo || "/images/operator_default_background/light.svg"}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/operator_default_background/light.svg";
                  }}
                />
                <div>
                  <Text variant="body-3-medium">
                    {name || shortenAddress(delegateAddress || "0x")}
                  </Text>
                  <Text
                    className="text-gray-500 font-robotoMono"
                    variant="caption-medium"
                  >
                    {delegateAddress}
                  </Text>
                </div>
              </div>
            </div>
            {isUpdateFlow && (
              <div className="flex flex-col gap-3">
                <Text variant="caption-medium" className="text-gray-500">
                  Total Delegated
                </Text>
                <div className="flex items-center justify-between px-6 py-4 rounded-[12px] bg-gray-100">
                  <Text variant="body-3-medium">
                    {ethFormatter.format(Number(delegatedValue))} ETH
                  </Text>
                  <div className="flex gap-2">
                    <img
                      className={"h-[24px] w-[15px]"}
                      src={`/images/balance-validator/balance-validator.svg`}
                    />
                    Validator Balance
                    <Text className="text-gray-500 font-medium">ETH</Text>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                My Validator Balance
              </Text>
              <div className="flex items-center justify-between px-6 py-4 rounded-[12px] bg-gray-100">
                <Text variant="body-3-medium">
                  {formatSSV(effectiveBalance || 0n)} ETH
                </Text>
                <div className="flex gap-2">
                  <img
                    className={"h-[24px] w-[15px]"}
                    src={`/images/balance-validator/balance-validator.svg`}
                  />
                  Validator Balance
                  <Text className="text-gray-500 font-medium">ETH</Text>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <NumericFormat
                  className="w-[140px] text-center h-[80px] text-[28px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px] overflow-hidden [&>input]:text-center"
                  value={delegatePercent}
                  decimalScale={2}
                  allowLeadingZeros={false}
                  isAllowed={numberFormatLimiter({
                    setter: setDelegatePercent,
                    maxValue,
                  })}
                  onValueChange={(values) =>
                    setDelegatePercent(values.floatValue || 0)
                  }
                  customInput={Input}
                  suffix="%"
                />
                <Text variant={"caption-medium"} className="text-gray-500">
                  Delegate
                </Text>
              </div>
              <Slider
                maxValue={maxValue}
                setValue={setDelegatePercent}
                value={delegatePercent}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-[140px] h-[80px] text-[28px] text-gray-5004 flex items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
                  {(
                    (restBalancePercentage * 100 + delegatedPercentage * 100) /
                    100
                  ).toFixed(2)}
                  %
                </div>
                <Text variant={"caption-medium"} className="text-gray-500">
                  Available
                </Text>
              </div>
            </div>
            <Button
              disabled={
                (!delegatePercent && !isUpdateFlow) ||
                delegatePercent === delegatedPercentage
              }
              isLoading={isPending}
              onClick={delegate}
              size={"lg"}
            >
              {isUpdateFlow && delegatePercent === 0
                ? "Remove"
                : isUpdateFlow
                  ? "Update"
                  : "Delegate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delegate;
