import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Span, Text } from "@/components/ui/text";
import { useStrategy } from "@/hooks/b-app/use-strategy";
import { useFeeEditorModal } from "@/signals/modal";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { Alert } from "@/components/ui/alert";
import { useStrategyFeeChangeRequestStatus } from "@/hooks/b-app/strategy/use-strategy-fee-change-request";
import { useReduceFee } from "@/lib/contract-interactions/b-app/write/use-reduce-fee";
import { useProposeFeeUpdate } from "@/lib/contract-interactions/b-app/write/use-propose-fee-update";
import { useFinalizeFeeUpdate } from "@/lib/contract-interactions/b-app/write/use-finalize-fee-update";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { numberFormatLimiter } from "@/lib/utils/number-input";
import { NumericFormat } from "react-number-format";
import { convertToPercentage } from "@/lib/utils/number";
import { useMaxFeeIncrement } from "@/lib/contract-interactions/b-app/read/use-max-fee-increment";
import { Explainer } from "@/app/routes/dashboard/b-app/strategies/fee-editor/explainer";
import { useArrowIncrement } from "@/hooks/utils/use-arrows-increment";
import { cn } from "@/lib/utils/tw";
import { FeeChangeStepper } from "@/app/routes/dashboard/b-app/strategies/fee-editor/fee-change-stepper";
import { wait } from "@/lib/utils/promise";

const formSchema = z.object({
  percentage: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export const StrategyFeeEditorModal = () => {
  const [isUpdatingRequest, setIsUpdatingRequest] = useState(false);
  const { meta, isOpen, onOpenChange } = useFeeEditorModal();

  const strategyQuery = useStrategy(meta.strategyId);
  const reduceFee = useReduceFee();
  const proposeFeeUpdate = useProposeFeeUpdate();
  const finalizeFeeUpdate = useFinalizeFeeUpdate();
  const maxFeeIncrement = useMaxFeeIncrement({
    select: convertToPercentage,
  });

  const changeRequest = useStrategyFeeChangeRequestStatus({
    strategyId: meta.strategyId!,
  });

  const currentFee = convertToPercentage(strategyQuery.strategy.fee);
  const requestedFee = convertToPercentage(
    changeRequest.request?.percentage ?? 0,
  );

  const maxAllowedFee = Math.min(currentFee + (maxFeeIncrement.data ?? 0), 100);

  const displayPercentage = changeRequest.hasRequested
    ? requestedFee
    : currentFee;

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      percentage: displayPercentage,
    },
    resolver: zodResolver(formSchema),
  });

  const percentage = form.watch("percentage");

  const isChanged = form.formState.isDirty;
  const isReducingFee = percentage < currentFee;
  const canInputAmount = !changeRequest.hasRequested || isUpdatingRequest;
  const canSubmitNewRequest = isUpdatingRequest && isChanged;

  useEffect(() => {
    form.reset({ percentage: displayPercentage });
    setIsUpdatingRequest(false);
  }, [form, isOpen, displayPercentage]);

  const ref = useRef<HTMLInputElement>(null);

  useArrowIncrement(ref, {
    value: percentage,
    onChange: (value) =>
      form.setValue("percentage", value, {
        shouldDirty: true,
        shouldValidate: true,
      }),
    min: 0,
    max: maxAllowedFee,
    step: 0.01,
  });

  const isPending =
    reduceFee.isPending ||
    proposeFeeUpdate.isPending ||
    finalizeFeeUpdate.isPending;

  const transactionOptions = withTransactionModal({
    onConfirmed: () => {
      onOpenChange(false);
    },
    onMined: async () => {
      changeRequest.invalidate();
      await wait(2000); // let the server catch up with the changes
      strategyQuery.invalidate();
      form.reset({ percentage: 0 });
    },
  });

  const submit = form.handleSubmit((values) => {
    const writer = isReducingFee ? reduceFee : proposeFeeUpdate;
    if (isReducingFee) changeRequest.clearRequestQueryData();
    return writer.write(
      {
        strategyId: Number(meta.strategyId),
        proposedFee: values.percentage * 100,
      },
      transactionOptions,
    );
  });

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-50 p-6 max-w-[648px] font-medium">
        <Form {...form}>
          <form onSubmit={submit} className="flex flex-col gap-8">
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
                  <Span>Change Strategy Fee</Span>
                  <FaInfoCircle className="size-3 text-gray-500" />
                </DialogTitle>
              </Tooltip>
              <DialogClose>
                <X className="size-4" />
              </DialogClose>
            </div>

            <div
              className={cn("w-full px-4", {
                "opacity-30": isReducingFee,
                grayscale: isReducingFee,
              })}
            >
              <FeeChangeStepper request={changeRequest} />
            </div>

            <Explainer
              status={changeRequest.status}
              expireTimestamp={changeRequest.periods.execution.end}
            />

            <div className="w-full flex items-center justify-between gap-4">
              <NumericFormat
                getInputRef={ref}
                className="w-[140px] text-center h-[80px] text-[28px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px] overflow-hidden [&>input]:text-center"
                value={percentage}
                decimalScale={2}
                allowLeadingZeros={false}
                disabled={!canInputAmount}
                isAllowed={numberFormatLimiter({
                  setter: (value) => form.setValue("percentage", value),
                  maxValue: maxAllowedFee,
                })}
                onValueChange={(values) =>
                  form.setValue("percentage", values.floatValue ?? 0, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                customInput={Input}
                suffix="%"
              />
              <Slider
                className="flex-1"
                disabled={!canInputAmount}
                value={[percentage]}
                max={100}
                min={0}
                step={0.01}
                onValueChange={(values) => {
                  const max = Math.min(values[0], maxAllowedFee);
                  return form.setValue("percentage", max, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
              <div className="w-[140px] h-[80px] text-[28px] flex items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
                100%
              </div>
            </div>

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
                    Request New Fee Change
                  </Button>
                </>
              )}
              {!changeRequest.hasRequested && (
                <Button
                  size="xl"
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                  disabled={!form.formState.isValid || !isChanged}
                >
                  {isReducingFee ? "Reduce Fee" : "Request Fee Change"}
                </Button>
              )}
              {changeRequest.inPendingPeriod && !isUpdatingRequest && (
                <Button
                  size="xl"
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                  disabled={true}
                >
                  Pending Fee Change...
                </Button>
              )}
              {changeRequest.inExecutionPeriod && (
                <Button
                  size="xl"
                  type="button"
                  className="w-full"
                  onClick={() =>
                    finalizeFeeUpdate.write(
                      {
                        strategyId: Number(meta.strategyId),
                      },
                      transactionOptions,
                    )
                  }
                  isLoading={isPending}
                >
                  Change Fee
                </Button>
              )}
              {changeRequest.inPendingPeriod && !isUpdatingRequest && (
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
              {changeRequest.isExpired && (
                <Button
                  size="xl"
                  type="button"
                  className="w-full"
                  onClick={changeRequest.clearRequestQueryData}
                >
                  Request New Fee Change
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

StrategyFeeEditorModal.displayName = "AssetWithdrawalModal";
