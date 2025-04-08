import { AssetLogo } from "@/components/ui/asset-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import { BigNumberInput } from "@/components/ui/number-input";
import { Span, Text, textVariants } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useDelegatedAsset } from "@/hooks/b-app/use-delegated-asset";
import { useStrategy } from "@/hooks/b-app/use-strategy";
import { useAsset } from "@/hooks/use-asset";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { formatSSV } from "@/lib/utils/number";
import { getStrategyName } from "@/lib/utils/strategy";
import { useAssetWithdrawalModal } from "@/signals/modal";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { Stepper } from "@/components/ui/stepper";
import { zeroAddress } from "viem";
import AssetName from "@/components/ui/asset-name";
import { Skeleton } from "@/components/ui/skeleton";
import { useProposeWithdrawal } from "@/lib/contract-interactions/b-app/write/use-propose-withdrawal";
import { useProposeWithdrawalETH } from "@/lib/contract-interactions/b-app/write/use-propose-withdrawal-eth";
import { useQueryClient } from "@tanstack/react-query";
import { getWithdrawalRequestsQueryKey } from "@/hooks/b-app/use-assets-withdrawals";

const formSchema = z.object({
  amount: z.bigint().min(BigInt(1), "Amount must be greater than 0"),
});

type FormValues = z.infer<typeof formSchema>;

export const AssetWithdrawalModal = () => {
  const queryClient = useQueryClient();
  const { meta, isOpen, onOpenChange } = useAssetWithdrawalModal();
  const { address } = useAccount();
  const navigate = useNavigate();
  const strategyQuery = useStrategy(meta.strategyId);

  const asset = useAsset(meta.asset);
  const delegated = useDelegatedAsset({
    token: meta.asset,
    contributor: address,
    strategyId: Number(meta.strategyId) || -1,
  });

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      amount: BigInt(0),
    },
    resolver: zodResolver(formSchema),
  });

  const withdrawAmount = form.watch("amount");

  useEffect(() => {
    form.reset({ amount: BigInt(0) });
  }, [meta.asset, form]);

  const withdrawERC20 = useProposeWithdrawal();
  const withdrawETH = useProposeWithdrawalETH();
  const isPending = withdrawETH.isPending || withdrawERC20.isPending;

  const deposit = form.handleSubmit((values) => {
    if (!meta.strategyId) return;
    const options = withTransactionModal({
      onConfirmed: () => {
        onOpenChange(false);
      },
      onMined: async () => {
        asset.refreshBalance();
        delegated.refresh();

        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: getWithdrawalRequestsQueryKey({
              strategyId: meta.strategyId!,
              token: meta.asset!,
            }),
          });
          strategyQuery.invalidate();
        }, 2000); // wait for the api to catch up and then invalidate the query
        form.reset({ amount: BigInt(0) });
        return () => {
          navigate(`/account`);
        };
      },
    });

    if (asset.isEthereum) {
      withdrawETH.write(
        {
          strategyId: Number(meta.strategyId),
          amount: values.amount,
        },
        options,
      );
    } else {
      withdrawERC20.write(
        {
          strategyId: Number(meta.strategyId),
          amount: values.amount,
          token: meta.asset!,
        },
        options,
      );
    }
  });

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-50 p-6 max-w-[648px] font-medium">
        <Form {...form}>
          <form onSubmit={deposit} className="flex  flex-col gap-8 ">
            <div className="flex justify-between items-center">
              <Tooltip
                asChild
                className="max-w-max"
                content={
                  <Text className="whitespace-nowrap">
                    Asset withdrawal takes 7 days to complete.{" "}
                    <Button
                      as="a"
                      variant="link"
                      href="#"
                      target="_blank"
                      className="inline"
                    >
                      Learn more about waiting period.
                    </Button>
                  </Text>
                }
              >
                <DialogTitle className="flex items-center gap-1">
                  <Span>Asset Withdrawal</Span>
                  <FaInfoCircle className="size-3 text-gray-500" />
                </DialogTitle>
              </Tooltip>
              <DialogClose>
                <X className="size-4" />
              </DialogClose>
            </div>
            <Stepper
              stepIndex={0}
              steps={[
                {
                  label: "Request",
                },
                {
                  label: "Pending",
                },
                {
                  label: "Withdrawable",
                },
              ]}
            />
            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                Withdrawing from
              </Text>
              <div className="flex items-center h-[52px] w-full bg-gray-100 rounded-xl px-6">
                {strategyQuery.isLoading ? (
                  <Skeleton className="h-full w-[152px] h-5" />
                ) : (
                  <Text variant="body-3-medium">
                    {getStrategyName(strategyQuery.strategy)}
                  </Text>
                )}
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                Total Delegated
              </Text>
              <div className="flex items-center justify-between h-[52px] w-full bg-gray-100 rounded-xl px-6">
                <Text variant="body-3-medium">
                  {formatSSV(
                    BigInt(delegated.data?.amount || 0),
                    asset.decimals,
                  )}{" "}
                  {asset.symbol}
                </Text>
                <div className="flex gap-2 items-center">
                  <AssetLogo
                    address={meta.asset || zeroAddress}
                    className="size-6"
                  />
                  <AssetName
                    className={textVariants({
                      variant: "body-3-medium",
                    })}
                    address={meta.asset || zeroAddress}
                  />
                </div>
              </div>
            </div>
            <Divider />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <BigNumberInput
                      max={asset.balance}
                      value={field.value}
                      decimals={asset.decimals}
                      onChange={field.onChange}
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
                              <AssetLogo
                                className="size-8"
                                address={meta.asset || zeroAddress}
                              />
                              <span className="text-[28px] font-medium">
                                {asset.symbol}
                              </span>
                            </div>
                          </div>
                          <Divider />
                          <div className="flex justify-between">
                            <Text
                              variant="body-2-medium"
                              className="text-gray-500"
                            >
                              Delegated Balance:{" "}
                              {formatSSV(
                                BigInt(delegated.data?.amount || 0),
                                asset.decimals,
                              )}
                            </Text>
                            <Button
                              variant="link"
                              className={textVariants({
                                variant: "body-2-medium",
                                className: "text-primary-500",
                              })}
                              onClick={() =>
                                form.setValue(
                                  "amount",
                                  BigInt(delegated.data?.amount || 0),
                                )
                              }
                              type="button"
                            >
                              Max
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              size="xl"
              type="submit"
              className="w-full"
              isLoading={isPending}
              disabled={!form.formState.isValid}
            >
              {withdrawAmount > 0 ? (
                <>
                  Withdraw {formatSSV(withdrawAmount, asset.decimals)}{" "}
                  {asset.symbol}
                </>
              ) : (
                <>Withdraw</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

AssetWithdrawalModal.displayName = "AssetWithdrawalModal";
