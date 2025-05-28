import type { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";

export const Wizard = ({
  title,
  onClose,
  children,
  steps,
  skipToStep,
  currentStepNumber = 0,
  onNext,
  isLoading,
  isNextDisabled,
  isNotWizard,
}: {
  title: string;
  onClose: () => void;
  onNext?: () => void;
  children: string | ReactNode;
  skipToStep?: () => void;
  currentStepNumber?: number;
  steps?: string[];
  isNextDisabled?: boolean;
  isNotWizard?: boolean;
  isLoading?: boolean;
}) => {
  const bApp = useCreateStrategyContext();
  if (
    onNext &&
    Object.keys(bApp.bApp).length !== 0 &&
    currentStepNumber === 0
  ) {
    onNext();
  }

  if (isNotWizard) {
    return children;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="w-full h-20 bg-gray-50 flex items-center justify-center">
        <div className="w-[1320px] flex items-center justify-between mx-5">
          <Text variant="body-1-bold">{title}</Text>
          {steps && (
            <div className={"flex items-center gap-3"}>
              {steps.map((step, i) => (
                <div key={`${step}_${i}`} className={"flex items-center gap-3"}>
                  <div className={"flex items-center gap-2"}>
                    <div
                      className={`size-6 bg-${currentStepNumber === i ? "primary-500" : currentStepNumber > i ? "primary-400" : "gray-400"} rounded-full flex items-center text-white font-bold text-[12px] justify-center`}
                    >
                      {currentStepNumber > i ? (
                        <img src={`/images/v/light.svg`} />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <Text variant="body-3-medium">{step}</Text>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-5 border border-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 w-full overflow-auto">{children}</div>
      <div className="w-full h-20 bg-gray-50 flex items-center justify-center px-5">
        <div className="w-[1320px] flex items-center justify-between">
          <div className="w-[160px] h-48px">
            <Button onClick={onClose} className="size-full" variant="secondary">
              {currentStepNumber === 0 ? "Cancel" : "Back"}
            </Button>
          </div>
          <div className="w-[160px] h-48px flex gap-1">
            {skipToStep && (
              <Button
                onClick={skipToStep}
                variant="secondary"
                className="size-full"
              >
                I'll do it later
              </Button>
            )}
            {currentStepNumber !== 0 && (
              <Button
                disabled={isNextDisabled}
                isLoading={isLoading}
                onClick={onNext}
                className="size-full"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
