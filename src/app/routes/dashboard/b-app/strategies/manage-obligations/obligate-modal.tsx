import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type FC, useEffect, useState } from "react";
import { useObligateModal } from "@/signals/modal.ts";
import { Text } from "@/components/ui/text.tsx";
import { Button, IconButton } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import type { Address } from "abitype";
import AssetName from "@/components/ui/asset-name.tsx";
import { useBApp } from "@/hooks/b-app/use-b-app.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import Slider from "@/components/ui/custom-slider.tsx";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input.tsx";
import { useCreateObligation } from "@/lib/contract-interactions/b-app/write/use-create-obligation.ts";
import { useProposeUpdateObligation } from "@/lib/contract-interactions/b-app/write/use-propose-update-obligation.ts";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx";
import { toast } from "@/components/ui/use-toast.ts";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import type { BAppAsset } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";
import { Link } from "react-router-dom";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { Stepper } from "@/components/ui/stepper.tsx";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise.ts";
import { useFinalizeUpdateObligation } from "@/lib/contract-interactions/b-app/write/use-finalize-update-obligation.ts";
import { cn } from "@/lib/utils/tw.ts";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { formatDistance } from "date-fns";
import { useManageObligation } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/use-manage-obligation.ts";
import { getObligationData } from "@/lib/utils/manage-obligation.ts";
import ObligateModalDescription from "@/app/routes/dashboard/b-app/strategies/manage-obligations/obligate-modal-description.tsx";

export type ObligateModalProps = {
  //   TODO:
};

export const ObligateModal: FC<ObligateModalProps> = () => {
  const modal = useObligateModal();

  const { bApp } = useBApp(modal.meta.bAppId);
  const strategyData = useStrategy(modal.meta.strategyId);
  const { strategy } = strategyData;

  const {
    isPending,
    isPendingEnd,
    isFinalizeEnd,
    isWaiting,
    isExpired,
    isObligated,
  } = useManageObligation(
    modal.meta.strategyId || "",
    modal.meta.bAppId || "",
    modal.meta.token || "0x",
  );

  const obligations = (strategy.depositsPerToken || []).filter(
    (bAppAsset: BAppAsset) =>
      (bAppAsset.obligations || []).some(
        ({ bAppId }) =>
          bAppId.toLowerCase() === modal.meta.bAppId?.toLowerCase(),
      ),
  );

  const obligationData = getObligationData(
    obligations,
    modal.meta.token || "0x",
    modal.meta.bAppId || "0x",
  );

  const [obligation, setObligation] = useState(
    convertToPercentage(
      isWaiting || isPending
        ? obligationData?.percentageProposed || 0
        : obligationData?.percentage || 0,
    ),
  );
  const [reUpdateNewObligation, setReUpdateNewObligation] = useState(false);

  const createObligation = useCreateObligation();
  const updateObligation = useProposeUpdateObligation();
  const finalizeUpdateObligation = useFinalizeUpdateObligation();

  const submitObligation = async () => {
    const method = isObligated ? updateObligation : createObligation;

    const options = withTransactionModal({
      onMined: async () => {
        await retryPromiseUntilSuccess(() =>
          getStrategyById(strategy.id)
            .then((strategy) => {
              const obligations = (strategy.depositsPerToken || []).filter(
                (bAppAsset: BAppAsset) =>
                  (bAppAsset.obligations || []).some(
                    ({ bAppId }) =>
                      bAppId.toLowerCase() === modal.meta.bAppId?.toLowerCase(),
                  ),
              );

              const newObl = getObligationData(
                obligations,
                modal.meta.token || "0x",
                modal.meta.bAppId || "",
              );

              return (
                obligationData?.percentageProposed.toString() !==
                  newObl?.percentageProposed.toString() ||
                obligationData?.percentageProposedTimestamp.toString() !==
                  newObl?.percentageProposedTimestamp.toString()
              );
            })
            .catch(() => false),
        );
        await strategyData.invalidate();
        toast({
          title: "Transaction confirmed",
          description: new Date().toLocaleString(),
        });
        setReUpdateNewObligation(false);
        modal.close();
      },
    });

    const params = {
      strategyId: Number(strategy.id),
      bApp: bApp.id,
      token: modal.meta.token || "0x",
    };

    if (isWaiting) {
      await finalizeUpdateObligation.write(params, options);
    } else {
      await method.write(
        { ...params, obligationPercentage: Math.round(obligation * 100) },
        options,
      );
    }
  };

  useEffect(() => {
    setObligation(
      convertToPercentage(
        isWaiting || isPending
          ? obligationData?.percentageProposed || 0
          : obligationData?.percentage || 0,
      ),
    );
  }, [modal.isOpen]);

  const stepperIndex =
    (!isWaiting && !isPending && !isExpired) || reUpdateNewObligation
      ? 0
      : isPending && !reUpdateNewObligation
        ? 1
        : 2;
  const percentage = convertToPercentage(obligationData?.percentage || 0);
  const proposedPercentage = convertToPercentage(
    obligationData?.percentageProposed || 0,
  );

  const isSameAsPercentage = obligation === percentage;
  const isSameAsProposed = obligation === proposedPercentage;

  const isDisabled =
    (!reUpdateNewObligation && isPending) ||
    ((isSameAsPercentage || isSameAsProposed) &&
      (isPending || reUpdateNewObligation));

  return (
    <Dialog {...modal}>
      <DialogContent
        asChild
        className="max-w-[648px] max-h-[830px] bg-white p-6 overflow-y-auto"
      >
        <div className="w-full h-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <Text variant={"body-1-bold"}>
                {isObligated ? "Change" : "Add"} Obligation
              </Text>
              <Tooltip
                asChild
                content={
                  <Text>
                    Learn more about&nbsp;
                    <Link
                      target={"_blank"}
                      className={"text-primary-500"}
                      to={
                        isObligated
                          ? "https://docs.ssv.network/based-applications/user-guides/strategy-features/manage-obligations/change-obligation/"
                          : "https://docs.ssv.network/based-applications/user-guides/strategy-features/manage-obligations/add-obligation/"
                      }
                    >
                      {isObligated ? "Changing" : "Adding"}&nbsp;Obligations
                    </Link>
                  </Text>
                }
              >
                <div className="flex items-center justify-center">
                  <FaCircleInfo className="text-gray-500" />
                </div>
              </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-8">
              <IconButton
                variant="ghost"
                onClick={async (ev) => {
                  setReUpdateNewObligation(false);
                  ev.preventDefault();
                  modal.close();
                }}
                className="text-gray-900 flex items-center justify-center right-0 top-0"
              >
                <X className="text-gray-900 size-5" />
              </IconButton>
            </div>
          </div>
          {isObligated && (
            <div>
              <Stepper
                withoutStepNumber
                stepIndex={stepperIndex}
                steps={[
                  {
                    label: "Request",
                    variant:
                      (isPending || isWaiting || isExpired) &&
                      !reUpdateNewObligation
                        ? "done"
                        : "active",
                  },
                  {
                    label: "Pending",
                    variant:
                      isPending && !reUpdateNewObligation
                        ? "warning"
                        : isWaiting || (isExpired && !reUpdateNewObligation)
                          ? "done"
                          : "default",
                    addon: isPending && !reUpdateNewObligation && (
                      <Text className="text-xs text-secondary-sunshineLight">
                        {formatDistance(isPendingEnd || 0, Date.now(), {
                          addSuffix: false,
                        })}{" "}
                        left
                      </Text>
                    ),
                  },
                  {
                    label: "Change",
                    variant:
                      isWaiting && !reUpdateNewObligation
                        ? "withdrawable"
                        : isExpired && !reUpdateNewObligation
                          ? "gray"
                          : "default",
                    addon: isWaiting && !reUpdateNewObligation && (
                      <Text className="text-xs text-success-500">
                        Expires in{" "}
                        {formatDistance(isFinalizeEnd || 0, Date.now(), {
                          addSuffix: false,
                        })}
                      </Text>
                    ),
                  },
                ]}
              />
            </div>
          )}
          <ObligateModalDescription
            isObligated={isObligated}
            isPending={isPending && !reUpdateNewObligation}
            isWaiting={isWaiting}
            isExpired={isExpired && !reUpdateNewObligation}
            endTime={formatDistance(isPendingEnd || 0, Date.now(), {
              addSuffix: false,
            })}
          />
          <div>
            <Text variant="caption-medium" className="text-gray-500">
              Selected bApp
            </Text>
            <div className="flex gap-2 items-center px-6 w-full h-[52px] bg-gray-100 rounded-[12px]">
              <img
                className="rounded-[8px] size-7 border-gray-400 border"
                src={
                  bApp?.logo || "/images/operator_default_background/light.svg"
                }
                onError={(e) => {
                  e.currentTarget.src =
                    "/images/operator_default_background/light.svg";
                }}
              />
              <Text variant={"body-3-medium"}>
                {bApp?.name || shortenAddress(bApp?.id || "0x")}
              </Text>
            </div>
          </div>
          <div>
            <Text variant="caption-medium" className="text-gray-500">
              Asset
            </Text>
            <div className="flex gap-2 items-center px-6 w-full h-[52px] bg-gray-100 rounded-[12px]">
              <AssetLogo address={modal.meta.token as Address} />
              <AssetName
                className="font-[14px] "
                address={modal.meta.token as Address}
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <NumericFormat
                className={cn(
                  "w-[140px] text-center h-[80px] text-[28px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px] overflow-hidden [&>input]:text-center",
                  {
                    "text-gray-400":
                      (isPending || isWaiting || isExpired) &&
                      !reUpdateNewObligation,
                    "border-gray-400":
                      (isPending || isWaiting || isExpired) &&
                      !reUpdateNewObligation,
                  },
                )}
                value={obligation}
                decimalScale={2}
                allowLeadingZeros={false}
                onValueChange={(values) =>
                  setObligation(values.floatValue || 0)
                }
                disabled={
                  (isPending || isWaiting || isExpired) &&
                  !reUpdateNewObligation
                }
                customInput={Input}
                suffix="%"
              />
              <Text variant={"caption-medium"} className="text-gray-500">
                Delegate
              </Text>
            </div>
            <Slider
              disable={
                (isPending || isWaiting || isExpired) && !reUpdateNewObligation
              }
              maxValue={100}
              setValue={(value) => {
                setObligation(value);
              }}
              value={obligation}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-[140px] h-[80px] text-[28px] text-gray-5004 flex items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
                100%
              </div>
              <Text variant={"caption-medium"} className="text-gray-500">
                Available
              </Text>
            </div>
          </div>
          {reUpdateNewObligation && !isExpired && (
            <Alert variant="warning" className="flex gap-4 items-center">
              <AlertDescription>
                New request will replace the current one and reset the pending
                period.
              </AlertDescription>
            </Alert>
          )}
          <div className={"flex flex-col gap-3"}>
            <Button
              className={"h-[60px]"}
              disabled={isDisabled}
              // disabled={
              //   (!reUpdateNewObligation && isPending) ||
              //   ((obligation ===
              //     convertToPercentage(obligationData?.percentage || 0) ||
              //     (obligation ===
              //       convertToPercentage(
              //         obligationData?.percentageProposed || 0,
              //       ) &&
              //       !reUpdateNewObligation)) &&
              //     (isPending || reUpdateNewObligation))
              // }
              isLoading={
                createObligation.isPending ||
                updateObligation.isPending ||
                finalizeUpdateObligation.isPending
              }
              onClick={
                isExpired && !reUpdateNewObligation
                  ? () => setReUpdateNewObligation(true)
                  : submitObligation
              }
            >
              {isWaiting
                ? "Change"
                : isPending && !reUpdateNewObligation
                  ? `Pending ${obligation}% Obligation Change `
                  : isExpired && !reUpdateNewObligation
                    ? "Request new Obligation Change"
                    : "Request Obligation Change"}
            </Button>
            {isPending && !reUpdateNewObligation && (
              <Button
                className={"h-[60px]"}
                variant={"secondary"}
                onClick={() => setReUpdateNewObligation(true)}
              >
                Update request
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ObligateModal.displayName = "ObligateModal";
