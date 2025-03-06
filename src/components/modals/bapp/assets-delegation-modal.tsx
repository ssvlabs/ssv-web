import { AssetLogo } from "@/components/ui/asset-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import { NumberInput } from "@/components/ui/number-input";
import { Text, textVariants } from "@/components/ui/text";
import { WithAllowance } from "@/components/with-allowance/with-allowance";
import { useAccount } from "@/hooks/account/use-account";
import { useDelegatedAsset } from "@/hooks/b-app/use-delegated-asset";
import { useStrategy } from "@/hooks/b-app/use-strategy";
import { useAsset } from "@/hooks/use-asset";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useDepositERC20 } from "@/lib/contract-interactions/b-app/write/use-deposit-erc-20";
import { useDepositETH } from "@/lib/contract-interactions/b-app/write/use-deposit-eth";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { formatSSV } from "@/lib/utils/number";
import { getStrategyName } from "@/lib/utils/strategy";
import { useAssetsDelegationModal } from "@/signals/modal";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const AssetsDelegationModal = () => {
  const { meta, isOpen, onOpenChange } = useAssetsDelegationModal();
  const { bAppContractAddress } = useSSVNetworkDetails();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { strategy, invalidate } = useStrategy();

  const asset = useAsset(meta.asset);
  const delegated = useDelegatedAsset({
    token: meta.asset,
    contributor: address,
    strategyId: Number(meta.strategy?.id) || -1,
  });

  const [amount, setAmount] = useState<bigint>(BigInt(0));
  useEffect(() => {
    setAmount(BigInt(0));
  }, [meta.asset]);

  const depositERC20 = useDepositERC20();
  const depositETH = useDepositETH();
  const isPending = depositETH.isPending || depositERC20.isPending;

  const deposit = () => {
    if (!meta.strategy) return;
    const options = withTransactionModal({
      onConfirmed: () => {
        onOpenChange(false);
      },
      onMined: () => {
        asset.refreshBalance();
        delegated.refresh();
        invalidate();
        return () => {
          navigate(`/account`);
        };
      },
    });

    if (asset.isEthereum) {
      depositETH.write(
        {
          strategyId: Number(meta.strategy!.id),
        },
        amount,
        options,
      );
    } else {
      depositERC20.write(
        {
          strategyId: Number(meta.strategy!.id),
          amount,
          token: meta.asset!,
        },
        options,
      );
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex bg-gray-50 p-6 flex-col gap-8 max-w-[648px] font-medium">
        <div className="flex justify-between items-center">
          <DialogTitle>Assets Delegation</DialogTitle>
          <DialogClose>
            <X className="size-4" />
          </DialogClose>
        </div>
        <div className="flex flex-col gap-3">
          <Text variant="caption-medium" className="text-gray-500">
            Delegating to
          </Text>
          <div className="flex items-center h-[52px] w-full bg-gray-100 rounded-xl px-6">
            <Text variant="body-3-medium">{getStrategyName(strategy)}</Text>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Text variant="caption-medium" className="text-gray-500">
            Delegated
          </Text>
          <div className="flex items-center h-[52px] w-full bg-gray-100 rounded-xl px-6">
            <Text variant="body-3-medium">
              {formatSSV(BigInt(delegated.data?.amount || 0), asset.decimals)}{" "}
              {asset.symbol}
            </Text>
          </div>
        </div>

        <NumberInput
          max={asset.balance}
          value={amount}
          decimals={asset.decimals}
          onChange={(value) => setAmount(value)}
          placeholder=""
          render={(props, ref) => (
            <div className="flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-primary-300 bg-gray-100">
              <div className="flex h-14 items-center gap-5">
                <input
                  placeholder="0"
                  className="w-full h-full border outline-none flex-1 text-[28px] font-medium border-none bg-transparent"
                  {...props}
                  ref={ref}
                />

                <div className="flex items-center gap-2">
                  {meta.asset && (
                    <AssetLogo className="size-8" address={meta.asset} />
                  )}
                  <span className="text-[28px] font-medium">
                    {asset.symbol}
                  </span>
                </div>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text variant="body-2-medium" className="text-gray-500">
                  Available Balance: {formatSSV(asset.balance || BigInt(0))}
                </Text>
                <Button
                  variant="link"
                  className={textVariants({
                    variant: "body-2-medium",
                    className: "text-primary-500",
                  })}
                  onClick={() => setAmount(asset.balance || BigInt(0))}
                >
                  Max
                </Button>
              </div>
            </div>
          )}
        />
        {asset.isEthereum ? (
          <Button
            size="xl"
            className="w-full"
            isLoading={isPending}
            disabled={amount === BigInt(0)}
            onClick={deposit}
          >
            Delegate
          </Button>
        ) : (
          meta.asset && (
            <WithAllowance
              size="xl"
              amount={amount}
              options={{
                spender: bAppContractAddress,
                token: {
                  address: meta.asset!,
                  symbol: asset.symbol,
                },
              }}
            >
              <Button
                size="xl"
                className="w-full"
                isLoading={isPending}
                disabled={amount === BigInt(0)}
                onClick={deposit}
              >
                Delegate
              </Button>
            </WithAllowance>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

AssetsDelegationModal.displayName = "AssetsDelegationModal";
