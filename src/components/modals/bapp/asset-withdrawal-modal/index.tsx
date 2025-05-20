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
import { formatSSV } from "@/lib/utils/number";
import { getStrategyName } from "@/lib/utils/strategy";
import { useAssetWithdrawalModal } from "@/signals/modal";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { zeroAddress } from "viem";
import AssetName from "@/components/ui/asset-name";
import { Skeleton } from "@/components/ui/skeleton";
import { useStrategyAssetWithdrawalRequest } from "@/hooks/b-app/use-asset-withdrawal-request";
import { WithdrawalStepper } from "./withdrawal-stepper";
import { useStrategyAssetWithdrawer } from "@/components/modals/bapp/asset-withdrawal-modal/use-strategy-asset-withdrawer";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/tw";
import { Alert } from "@/components/ui/alert";
import { track } from "@/lib/analytics/mixpanel";

const formSchema = z.object({
  amount: z.bigint().min(BigInt(1), "Amount must be greater than 0"),
});

type FormValues = z.infer<typeof formSchema>;

export const AssetWithdrawalModal = () => {
  const [isUpdatingRequest, setIsUpdatingRequest] = useState(false);
  const { meta, isOpen, onOpenChange } = useAssetWithdrawalModal();
  const { address } = useAccount();
  const navigate = useNavigate();
  const strategyQuery = useStrategy(meta.strategyId);

  const assetWithdrawalRequest = useStrategyAssetWithdrawalRequest({
    strategyId: meta.strategyId!,
    asset: meta.asset!,
  });

  const asset = useAsset(meta.asset);
  const delegated = useDelegatedAsset({
    token: meta.asset,
    contributor: address,
    strategyId: Number(meta.strategyId) || -1,
  });

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      amount: assetWithdrawalRequest.request.amount,
    },
    resolver: zodResolver(formSchema),
  });
  const canInputAmount =
    !assetWithdrawalRequest.hasRequested || isUpdatingRequest;

  const withdrawAmount = form.watch("amount");

  const canSubmitNewRequest =
    isUpdatingRequest &&
    withdrawAmount > 0n &&
    withdrawAmount !== assetWithdrawalRequest.request.amount;

  useEffect(() => {
    form.reset({ amount: assetWithdrawalRequest.request.amount });
    setIsUpdatingRequest(false);
  }, [meta.asset, form, isOpen, assetWithdrawalRequest.request.amount]);

  const withdrawer = useStrategyAssetWithdrawer({
    strategyId: meta.strategyId!,
    asset: meta.asset!,
  });

  const isPending =
    withdrawer.request.isPending || withdrawer.finalize.isPending;

  const transactionOptions = withTransactionModal({
    onConfirmed: () => {
      onOpenChange(false);
    },
    onMined: async () => {
      asset.refreshBalance();
      delegated.refresh();
      assetWithdrawalRequest.invalidate();
      setTimeout(strategyQuery.invalidate, 2000);
      form.reset({ amount: BigInt(0) });
      track("Strategy withdraw");
      return () => {
        navigate(`/account`);
      };
    },
  });

  const requestWithdraw = (amount: bigint) => {
    withdrawer.request.mutate(
      {
        amount,
        options: transactionOptions,
      },
      {
        onError: (error) => {
          toast({
            title: "Something went wrong",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const finalizeWithdraw = () => {
    withdrawer.finalize.mutate({
      options: transactionOptions,
    });
  };

  const submit = form.handleSubmit((values) => {
    if (!meta.strategyId) return;
    requestWithdraw(values.amount);
  });

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-50 p-6 max-w-[648px] font-medium">
        <Form {...form}>
          <form onSubmit={submit} className="flex  flex-col gap-8 ">
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

            <div className=" w-full px-4">
              <WithdrawalStepper request={assetWithdrawalRequest} />
            </div>

            <div className="flex flex-col gap-3">
              <Text variant="caption-medium" className="text-gray-500">
                Withdrawing from
              </Text>
              <div className="flex items-center h-[52px] w-full bg-gray-100 rounded-xl px-6">
                {strategyQuery.isLoading ? (
                  <Skeleton className="w-[152px] h-5" />
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
                Total Deposited
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
                      disabled={!canInputAmount}
                      max={BigInt(delegated.data?.amount || 0)}
                      value={field.value}
                      decimals={asset.decimals}
                      onChange={field.onChange}
                      placeholder=""
                      render={(props, ref) => (
                        <div
                          className={cn(
                            "flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-primary-300 bg-gray-100",
                            {
                              "opacity-50 pointer-events-none border-gray-300":
                                !canInputAmount,
                            },
                          )}
                        >
                          <div className="flex h-14 items-center gap-5">
                            <input
                              readOnly={!canInputAmount}
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
                              Deposited Balance:{" "}
                              {formatSSV(
                                BigInt(delegated.data?.amount || 0),
                                asset.decimals,
                              )}
                            </Text>
                            <Button
                              tabIndex={!canInputAmount ? -1 : undefined}
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
            <div className="flex flex-col gap-3">
              {isUpdatingRequest && (
                <>
                  <Alert variant="warning">
                    New request will replace the current one and reset the
                    pending period.
                  </Alert>
                  <Button
                    size="xl"
                    type="submit"
                    className="w-full"
                    isLoading={isPending}
                    disabled={!canSubmitNewRequest}
                  >
                    Request New Withdrawal
                  </Button>
                </>
              )}
              {!assetWithdrawalRequest.hasRequested && (
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
              )}
              {assetWithdrawalRequest.inPendingPeriod && !isUpdatingRequest && (
                <Button
                  size="xl"
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                  disabled={true}
                >
                  Pending{" "}
                  {formatSSV(
                    assetWithdrawalRequest.request.amount,
                    asset.decimals,
                  )}{" "}
                  {asset.symbol} Withdrawal...
                </Button>
              )}
              {assetWithdrawalRequest.inExecutionPeriod && (
                <Button
                  size="xl"
                  type="button"
                  className="w-full"
                  onClick={() => finalizeWithdraw()}
                  isLoading={isPending}
                >
                  Withdraw{" "}
                  {formatSSV(
                    assetWithdrawalRequest.request.amount,
                    asset.decimals,
                  )}{" "}
                  {asset.symbol}
                </Button>
              )}
              {assetWithdrawalRequest.inPendingPeriod && !isUpdatingRequest && (
                <Button
                  size="xl"
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsUpdatingRequest(true)}
                >
                  Update Request
                </Button>
              )}
              {assetWithdrawalRequest.isExpired && (
                <Button
                  size="xl"
                  type="button"
                  className="w-full"
                  onClick={assetWithdrawalRequest.clearRequestQueryData}
                >
                  Request New Withdrawal
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

AssetWithdrawalModal.displayName = "AssetWithdrawalModal";
