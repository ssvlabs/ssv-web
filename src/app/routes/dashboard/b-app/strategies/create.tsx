import { Wizard } from "@/components/ui/wizard.tsx";
import { useNavigate } from "react-router-dom";
import BApps from "@/app/routes/dashboard/b-app/strategies/b-apps.tsx";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import Fee from "@/app/routes/dashboard/b-app/strategies/fee.tsx";
import Metadata from "@/app/routes/dashboard/b-app/strategies/metadata.tsx";
import { useState } from "react";

enum CreateSteps {
  SelectBApp = 0,
  SetObligations = 1,
  SetFee = 2,
  AddMetadata = 3,
}

const STEPS_LABELS = {
  [CreateSteps.SelectBApp]: "Select bApp",
  [CreateSteps.SetObligations]: "Set Obligations",
  [CreateSteps.SetFee]: "Set Fee",
  [CreateSteps.AddMetadata]: "Add Metadata",
};

const Create = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(CreateSteps.SelectBApp);

  const steps = {
    [CreateSteps.SelectBApp]: BApps,
    [CreateSteps.SetObligations]: Obligations,
    [CreateSteps.SetFee]: Fee,
    [CreateSteps.AddMetadata]: Metadata,
  };

  const Component = steps[currentStep];

  return (
    <Wizard
      onNext={() => {
        setCurrentStep(
          currentStep < CreateSteps.AddMetadata ? currentStep + 1 : currentStep,
        );
      }}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      children={<Component />}
      currentStepNumber={currentStep}
      onClose={() => {
        currentStep === CreateSteps.SelectBApp
          ? navigate(-1)
          : setCurrentStep(currentStep - 1);
      }}
    />
  );
};

export default Create;
