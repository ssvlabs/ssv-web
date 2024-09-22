import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
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
        <Text variant="headline4">Cluster Balances and Fees</Text>
        <Text>
          Fees are presented as annual payments but are paid to operators
          continuously as an on-going process. They are set by each operator and
          could change according to their decision.
        </Text>
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
        <label htmlFor="agree-1" className="flex gap-2 items-center">
          <Checkbox
            checked={agree1}
            id="agree-1"
            onCheckedChange={(checked: boolean) => setAgree1(checked)}
          />
          <Text>
            I understand that fees might change according to market dynamics
          </Text>
        </label>
        <label htmlFor="agree-2" className="flex gap-2 items-center">
          <Checkbox
            checked={agree2}
            id="agree-2"
            onCheckedChange={(checked: boolean) => setAgree2(checked)}
          />
          <Text>I understand the risks of having my cluster liquidated</Text>
        </label>
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
