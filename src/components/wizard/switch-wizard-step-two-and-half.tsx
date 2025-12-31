import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";

type SwitchWizardStepTwoAndHalfProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
};

export const SwitchWizardStepTwoAndHalf = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
}: SwitchWizardStepTwoAndHalfProps) => {
  const [feesAcknowledged, setFeesAcknowledged] = useState(false);
  const [liquidationAcknowledged, setLiquidationAcknowledged] = useState(false);
  const canProceed = feesAcknowledged && liquidationAcknowledged;

  const handleNext = () => {
    if (!canProceed) return;
    onNext();
  };

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
        className="w-full flex flex-col gap-6 p-8 bg-white rounded-2xl"
      >
        <div className="flex flex-col gap-4 items-start">
          <Text variant="headline4">Cluster Balances and Fees</Text>
          <Text variant="body-2-medium" className="text-gray-700">
            Your cluster's runway is determined by your deposited balance and
            the operator and network fees accrued over time. These fees scale
            with your validators' <span className="font-semibold">effective balance</span>.
          </Text>
          <Text variant="body-2-medium" className="text-gray-700">
            While displayed as annual amounts, fees are paid continuously as an
            ongoing process - so any changes in operator pricing or network
            conditions can impact your fee and shorten or extend your runway.
          </Text>
        </div>

        <Alert variant="error" className="rounded-lg text-gray-700">
          <AlertDescription className="text-sm font-medium">
            Clusters with insufficient balance are at risk of being{" "}
            <Button
              as="a"
              variant="link"
              href="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
            >
              liquidated
            </Button>
            , which will result in inactivation (
            <Button
              as="a"
              variant="link"
              href="https://launchpad.ethereum.org/en/faq#responsibilities"
            >
              penalties on the beacon chain
            </Button>
            ) of their validators, as they will no longer be operated by the
            network.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <Checkbox
              checked={feesAcknowledged}
              onCheckedChange={(checked) =>
                setFeesAcknowledged(checked === true)
              }
              className="mt-0.5"
            />
            <Text variant="body-2-medium" className="text-gray-700 flex-1">
              I understand that fees might change according to market dynamics
            </Text>
          </div>
          <div className="flex gap-3 items-start">
            <Checkbox
              checked={liquidationAcknowledged}
              onCheckedChange={(checked) =>
                setLiquidationAcknowledged(checked === true)
              }
              className="mt-0.5"
            />
            <Text variant="body-2-medium" className="text-gray-700 flex-1">
              I understand the risks of having my cluster liquidated
            </Text>
          </div>
        </div>

        <Button
          size="xl"
          width="full"
          onClick={handleNext}
          disabled={!canProceed}
          className="font-semibold"
        >
          Next
        </Button>
      </Card>
    </Container>
  );
};
