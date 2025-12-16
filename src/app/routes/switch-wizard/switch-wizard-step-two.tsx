import { SwitchWizardStepTwo } from "@/components/wizard";
import { useNavigate } from "react-router-dom";
import type { Operator } from "@/types/api";

// Mock operators for demonstration
const mockOperators: Pick<Operator, "id" | "name" | "logo" | "fee">[] = [
  {
    id: 1001,
    name: "Operator Alpha",
    fee: "23700000000000000",
    logo: "",
  },
  {
    id: 1002,
    name: "Operator Beta",
    fee: "22800000000000000",
    logo: "",
  },
  {
    id: 1003,
    name: "Operator Gamma",
    fee: "22200000000000000",
    logo: "",
  },
  {
    id: 1004,
    name: "Operator Delta",
    fee: "21200000000000000",
    logo: "",
  },
];

export const SwitchWizardStepTwoRoute = () => {
  const navigate = useNavigate();

  return (
    <SwitchWizardStepTwo
      onNext={() => {
        navigate("/switch-wizard/step-three");
      }}
      onBack={() => {
        navigate("/switch-wizard");
      }}
      backButtonLabel="Back"
      navigateRoutePath="/switch-wizard"
      operators={mockOperators}
      validatorsAmount={1}
    />
  );
};
