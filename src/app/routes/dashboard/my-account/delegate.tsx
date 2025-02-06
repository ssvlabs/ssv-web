import { Text } from "@/components/ui/text.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import Slider from "@/components/ui/slider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { formatSSV } from "@/lib/utils/number.ts";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx";
import { useDelegateBalance } from "@/lib/contract-interactions/b-app/write/use-delegate-balance.ts";

const Delegate = ({
  closeDelegatePopUp,
}: {
  closeDelegatePopUp: () => void;
}) => {
  const [delegatePercent, setDelegatePercent] = useState(0);
  const [searchParams] = useSearchParams();
  const address = searchParams.get("delegateAddress") || "0x";
  const { effectiveBalance, restBalancePercentage } = useMyBAppAccount();
  const delegateBalance = useDelegateBalance();
  const isPending = delegateBalance.isPending;
  const navigate = useNavigate();
  const delegate = async () => {
    const options = withTransactionModal({
      onMined: () => {
        return () => navigate(`/account`);
      },
    });
    const cleanedNumber = Math.round(delegatePercent * 100);
    delegateBalance.write(
      {
        account: address as `0x${string}`,
        percentage: cleanedNumber,
      },
      options,
    );
  };

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
                  src={"/images/operator_default_background/light.svg"}
                />
                <div>
                  <Text variant="body-3-medium">{shortenAddress(address)}</Text>
                  <Text className="text-gray-500" variant="caption-medium">
                    {address}
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                My Validator Balance
              </Text>
              <div className="flex items-center justify-between px-6 py-4 rounded-[12px] bg-gray-100">
                <Text variant="body-3-medium">
                  {formatSSV(effectiveBalance || 0n, 9)} ETH
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
              <div className="w-[140px] h-[80px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px]">
                {delegatePercent}%
              </div>
              <Slider
                maxValue={restBalancePercentage}
                setValue={setDelegatePercent}
                value={delegatePercent}
              />
              <div className="w-[140px] h-[80px] flex items-center justify-center bg-gray-100 border rounded-[12px]">
                {restBalancePercentage}%
              </div>
            </div>
            <Button isLoading={isPending} onClick={delegate} size={"lg"}>
              Delegate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delegate;
