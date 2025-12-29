import { Container } from "@/components/ui/container.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import type { Operator } from "@/types/api.ts";
import { OperatorFeeComparison } from "./operator-fee-comparison.tsx";

type SwitchWizardStepOneProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  operators: Pick<Operator, "id" | "name" | "logo" | "fee" | "eth_fee">[];
};

export const SwitchWizardStepOne = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  operators,
}: SwitchWizardStepOneProps) => {
  return (
    <Container
      variant="vertical"
      className="py-6"
      backButtonLabel={backButtonLabel}
      navigateRoutePath={navigateRoutePath}
      onBackButtonClick={onBack}
    >
      <Card
        variant="unstyled"
        className="w-full flex flex-col gap-5 p-8 bg-white rounded-2xl"
      >
        <div className="flex flex-col gap-4 items-start">
          <Text variant="headline4">Switch Cluster to ETH Fees</Text>
          <Text variant="body-2-medium" className="text-gray-700 leading-6">
            You are about to migrate your cluster from SSV-denominated payments
            to ETH-based operator and network fees.
            <br />
            <br />
            After switching, all future fees will be paid exclusively in ETH,
            and any SSV previously deposited for this cluster will be withdrawn
            to your wallet.
          </Text>
        </div>

        <Alert variant="warning" className="flex gap-3 items-center px-4 py-3">
          <AlertDescription className="text-sm font-medium text-gray-800">
            Once you switch, this change is permanent and cannot be reversed.
          </AlertDescription>
        </Alert>

        <OperatorFeeComparison operators={operators} />

        <Button
          variant="default"
          size="lg"
          width="full"
          onClick={onNext}
          className="font-semibold"
        >
          Choose Your Period
        </Button>
      </Card>
    </Container>
  );
};
