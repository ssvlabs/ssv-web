import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

export const BalanceWarning: FC = () => {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card>
        <CardHeader
          title="Cluster Balances and Fees"
          description="Your cluster’s runway is determined by your deposited balance and the operator and network fees accrued over time. These fees scale with your validators’ effective balance."
        />
        <Text variant="body-2-medium">While displayed as annual amounts, fees are paid continuously as an on-going process - so any changes in operator pricing or network conditions can impact your fee and shorten or extend your runway.</Text>
        <Alert variant="error">
          <AlertDescription>
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
          <label htmlFor="agree-1" className="flex gap-2 items-center">
            <Checkbox
              checked={agree1}
              id="agree-1"
              onCheckedChange={(checked: boolean) => setAgree1(checked)}
            />
            <Text variant="body-2-medium">
              I understand that fees might change according to market dynamics
            </Text>
          </label>
          <label htmlFor="agree-2" className="flex gap-2 items-center">
            <Checkbox
              checked={agree2}
              id="agree-2"
              onCheckedChange={(checked: boolean) => setAgree2(checked)}
            />
            <Text variant="body-2-medium">
              I understand the risks of having my cluster liquidated
            </Text>
          </label>
        </div>
        <Button
          as={Link}
          to="../slashing-warning"
          size="xl"
          disabled={!agree1 || !agree2}
        >
          Next
        </Button>
      </Card>
    </Container>
  );
};

BalanceWarning.displayName = "BalanceWarning";
