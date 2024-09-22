import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeeChange } from "@/components/ui/fee-change";
import { Text } from "@/components/ui/text";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { Link } from "react-router-dom";

export const OperatorFeeUpdated: FC = () => {
  const state = useUpdateOperatorFeeContext();
  return (
    <Container variant="vertical" className="py-6">
      <Card>
        <Text variant="headline4">Update Fee</Text>
        <Text>
          You have successfully updated your fee. The new fee will take effect
          immediately.
        </Text>
        <FeeChange
          previousFee={state.previousYearlyFee}
          newFee={state.newYearlyFee}
        />
        <Button as={Link} to="/operators" size="xl">
          Back To My Account
        </Button>
      </Card>
    </Container>
  );
};

OperatorFeeUpdated.displayName = "OperatorFeeUpdated";
