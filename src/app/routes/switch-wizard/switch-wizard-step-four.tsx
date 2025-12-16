import { SwitchWizardStepFour } from "@/components/wizard";
import { useAccount } from "@/hooks/account/use-account";
import { createClusterHash } from "@/lib/utils/cluster";
import type { Operator } from "@/types/api";

// Mock operators for demonstration
const mockOperators: Pick<Operator, "id" | "name" | "logo">[] = [
  {
    id: 1001,
    name: "Operator Alpha",
    logo: "",
  },
  {
    id: 1002,
    name: "Operator Beta",
    logo: "",
  },
  {
    id: 1003,
    name: "Operator Gamma",
    logo: "",
  },
  {
    id: 1004,
    name: "Operator Delta",
    logo: "",
  },
];

export const SwitchWizardStepFourRoute = () => {
  const account = useAccount();
  const operatorIds = mockOperators.map((op) => op.id);

  const clusterHash = account.address
    ? createClusterHash(account.address, operatorIds)
    : undefined;

  const clusterPath = clusterHash ? `/clusters/${clusterHash}` : undefined;

  return (
    <SwitchWizardStepFour
      clusterHash={clusterHash}
      operators={mockOperators}
      clusterPath={clusterPath}
    />
  );
};
