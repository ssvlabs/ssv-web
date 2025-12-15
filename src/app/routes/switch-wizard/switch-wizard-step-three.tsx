import { SwitchWizardStepThree } from "@/components/wizard";
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

export const SwitchWizardStepThreeRoute = () => {
  const navigate = useNavigate();

  return (
    <SwitchWizardStepThree
      onNext={() => {
        console.log("Switch completed");
        // TODO: Navigate to success page or handle completion
      }}
      onBack={() => {
        navigate("/switch-wizard/step-two");
      }}
      backButtonLabel="Back"
      navigateRoutePath="/switch-wizard/step-two"
      operators={mockOperators}
      fundingDays={182}
    />
  );
};
