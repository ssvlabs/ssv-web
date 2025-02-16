import { Wizard } from "@/components/ui/wizard.tsx";
import { useNavigate } from "react-router-dom";
import BApps from "@/app/routes/dashboard/b-app/strategies/b-apps.tsx";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import Fee from "@/app/routes/dashboard/b-app/strategies/fee.tsx";
import Metadata from "@/app/routes/dashboard/b-app/strategies/metadata.tsx";
import { useState } from "react";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp } from "@/api/b-app.ts";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx";
import { useCreateStrategy } from "@/lib/contract-interactions/b-app/write/use-create-strategy.ts";
import { useOptInToBApp } from "@/lib/contract-interactions/b-app/write/use-opt-in-to-b-app.ts";

export enum CreateSteps {
  SelectBApp = 0,
  SetObligations = 1,
  SetFee = 2,
  AddMetadata = 3,
}

export const STEPS_LABELS = {
  [CreateSteps.SelectBApp]: "Select bApp",
  [CreateSteps.SetObligations]: "Set Obligations",
  [CreateSteps.SetFee]: "Set Fee",
  [CreateSteps.AddMetadata]: "Add Metadata",
};

const Create = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(CreateSteps.SelectBApp);
  const { bApp, selectedObligations } = useCreateStrategyContext();
  const steps = {
    [CreateSteps.SelectBApp]: BApps,
    [CreateSteps.SetObligations]: Obligations,
    [CreateSteps.SetFee]: Fee,
    [CreateSteps.AddMetadata]: Metadata,
  };

  const backActionsToMap = {
    [CreateSteps.SelectBApp]: () => {
      navigate(-1);
    },
    [CreateSteps.SetObligations]: () => {
      useCreateStrategyContext.state.bApp = {} as BApp;
      setCurrentStep(currentStep - 1);
    },
    [CreateSteps.SetFee]: () => {
      useCreateStrategyContext.state.selectedFee = 0;
      setCurrentStep(currentStep - 1);
    },
    [CreateSteps.AddMetadata]: () => {
      setCurrentStep(currentStep - 1);
    },
  };

  const Component = steps[currentStep];
  const createStrategy = useCreateStrategy();
  const optInToBApp = useOptInToBApp();

  const onNext = async () => {
    let createdId = 0;
    if (currentStep === CreateSteps.AddMetadata) {
      const options = withTransactionModal({
        onMined: (receipt) => {
          createdId = parseInt(`${receipt.logs[0].topics[1]}`);
        },
      });

      const cleanedNumber = Math.round(
        useCreateStrategyContext.state.selectedFee * 100,
      );

      await createStrategy.write(
        {
          fee: cleanedNumber,
        },
        options,
      );
    }
    if (createdId && bApp && selectedObligations) {
      const tokens = Object.keys(selectedObligations) as `0x${string}`[];
      const obligationPercentages = [] as number[];
      tokens.forEach((token) => {
        obligationPercentages.push(
          Math.round(selectedObligations[token] * 100),
        );
      });
      const options = withTransactionModal({
        onMined: () => {
          return navigate("/strategies");
        },
      });

      await optInToBApp.write(
        {
          strategyId: BigInt(createdId),
          bApp: bApp.id,
          tokens,
          obligationPercentages,
          data: "0x00",
        },
        options,
      );
      navigate("/strategies");
    }
    setCurrentStep(
      currentStep < CreateSteps.AddMetadata ? currentStep + 1 : currentStep,
    );
  };

  return (
    <Wizard
      onNext={onNext}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={<Component />}
      currentStepNumber={currentStep}
      skipToStep={
        currentStep === 0 ? () => setCurrentStep(CreateSteps.SetFee) : undefined
      }
      onClose={() => {
        backActionsToMap[currentStep]();
      }}
    />
  );
};

export default Create;
