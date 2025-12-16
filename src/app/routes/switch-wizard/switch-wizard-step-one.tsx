import { SwitchWizardStepOne } from "@/components/wizard";
import { useNavigate } from "react-router-dom";

export const SwitchWizardStepOneRoute = () => {
  const navigate = useNavigate();

  return (
    <SwitchWizardStepOne
      onNext={() => {
        navigate("/switch-wizard/step-two");
      }}
      onBack={() => {
        console.log("Back clicked");
      }}
      backButtonLabel="Back"
      navigateRoutePath="/"
    />
  );
};
