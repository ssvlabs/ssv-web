import { Button, IconButton } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useStrategy } from "@/hooks/b-app/use-strategy";
import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { CreateSteps } from "@/types/b-app.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import SelectBApp from "@/app/routes/dashboard/b-app/strategies/select-b-app.tsx";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import { useOptInModal } from "@/signals/modal.ts";
import type { BApp } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { track } from "@/lib/analytics/mixpanel";
import { useOptInToBApp } from "@/lib/contract-interactions/b-app/write/use-opt-in-to-b-app.ts";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise.ts";

export type OptInModalProps = {
  // TODO: Add props or remove this type
};

const STEPS = {
  [CreateSteps.SelectBApp]: "Select bApp",
  [CreateSteps.SetObligations]: "Set Obligations",
};

export const OptInModal: FC<OptInModalProps> = () => {
  const modal = useOptInModal();
  const strategyData = useStrategy(modal.meta.strategyId);
  const { strategy } = strategyData;
  const { bApp, selectedObligations } = useCreateStrategyContext();
  const [currentStep, setCurrentStep] = useState<
    CreateSteps.SelectBApp | CreateSteps.SetObligations
  >(CreateSteps.SelectBApp);
  const optInToBApp = useOptInToBApp();

  useEffect(() => {
    if (Object.keys(bApp).length !== 0) {
      setCurrentStep(CreateSteps.SetObligations);
    }
  }, [Object.keys(bApp).length]);

  const optIn = async () => {
    const tokens = Object.keys(selectedObligations) as `0x${string}`[];
    const obligationPercentages = [] as number[];
    tokens.forEach((token) => {
      obligationPercentages.push(Math.round(selectedObligations[token] * 100));
    });
    await optInToBApp.write(
      {
        strategyId: Number(strategy.id),
        bApp: bApp.id,
        tokens,
        obligationPercentages,
        data: useCreateStrategyContext.state.registerData || "0x00",
      },
      withTransactionModal({
        onMined: async () => {
          await retryPromiseUntilSuccess(() =>
            getStrategyById(strategy.id)
              .then((strategy) => {
                return strategy.bAppsList?.some(
                  ({ bAppId }) =>
                    bAppId.toLowerCase() === bApp.id.toLowerCase(),
                );
              })
              .catch(() => false),
          );
          await strategyData.invalidate();
          toast({
            title: "Transaction confirmed",
            description: new Date().toLocaleString(),
          });
          track("Opt_In_to_BApp");
          closeModal();
        },
      }),
    );
  };

  const components: Record<
    CreateSteps.SelectBApp | CreateSteps.SetObligations,
    typeof SelectBApp | typeof Obligations
  > = {
    [CreateSteps.SelectBApp]: SelectBApp,
    [CreateSteps.SetObligations]: Obligations,
  };
  const closeModal = () => {
    modal.close();
    setCurrentStep(CreateSteps.SelectBApp);
    useCreateStrategyContext.state.bApp = {} as BApp;
    useCreateStrategyContext.state.selectedObligations = {};
  };

  const Component = components[currentStep];
  return (
    <Dialog {...modal}>
      <DialogContent
        asChild
        className="max-w-[1520px] h-[90%] bg-gray-200 p-0 overflow-y-auto "
      >
        <div className="flex flex-col gap-3.5">
          <div className="fixed w-full flex justify-between items-center pl-8 pr-7 h-20 bg-gray-100">
            <Text variant={"body-1-bold"}>
              {strategy.name || `Strategy ${strategy.id}`}
            </Text>

            <div className="flex justify-between items-center gap-8">
              <div className={"flex items-center gap-3"}>
                {Object.values(STEPS).map((step, i) => (
                  <div
                    key={`${step}_${i}`}
                    className={"flex items-center gap-3"}
                  >
                    <div className={"flex items-center gap-2"}>
                      <div
                        className={`size-6 bg-${currentStep === i ? "primary-500" : currentStep > i ? "primary-400" : "gray-400"} rounded-full flex items-center text-white font-bold text-[12px] justify-center`}
                      >
                        {currentStep > i ? (
                          <img src={`/images/v/light.svg`} />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <Text variant="body-3-medium">{step}</Text>
                    </div>
                    {i < Object.values(STEPS).length - 1 && (
                      <div className="w-5 border border-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              <IconButton
                variant="ghost"
                onClick={closeModal}
                className="text-gray-900 flex items-center justify-center right-0 top-0"
              >
                <X className="text-gray-900 size-4" />
              </IconButton>
            </div>
          </div>
          <div className="mt-[80px] mb-[80px] overflow-auto">
            <Component isNotWizard />
          </div>
          <div className="fixed w-full bottom-0 flex justify-between items-center pl-8 pr-7 h-20 bg-gray-100">
            <Button
              disabled={optInToBApp.isPending}
              onClick={() => {
                if (currentStep === CreateSteps.SelectBApp) {
                  closeModal();
                } else {
                  setCurrentStep(CreateSteps.SelectBApp);
                  useCreateStrategyContext.state.bApp = {} as BApp;
                  useCreateStrategyContext.state.selectedObligations = {};
                }
              }}
              variant="secondary"
            >
              {currentStep === CreateSteps.SelectBApp ? "Cancel" : "Back"}
            </Button>
            {currentStep === CreateSteps.SetObligations && (
              <Button isLoading={optInToBApp.isPending} onClick={optIn}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

OptInModal.displayName = "OptInModal";
