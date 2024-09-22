import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ValidatorsBulkSummary } from "@/components/cluster/validators-bulk-summary";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import { Span, Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import ExitStateImg from "@/assets/images/exit-state.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ExitValidatorsSuccess: FC = () => {
  const { selectedPublicKeys } = useBulkActionContext();
  return (
    <Container
      variant="horizontal"
      size="xl"
      className="p-6 font-medium w-[1096px]"
    >
      <Card className="flex-[1.7]">
        <Text variant="headline4">Exit Validator</Text>
        <Text variant="body-2-medium">
          Your request to exit the validator has been successfully broadcasted
          to the network.
        </Text>
        <Divider />
        <Text variant="headline4">Next Steps</Text>
        <Text variant="body-2-medium">
          1. <Span variant="body-2-bold">Monitor Validator</Span>: Keep track of
          your validator until it fully exits.
        </Text>
        <img src={ExitStateImg} alt="Exit State" />
        <Text variant="body-2-medium">
          2. <Span variant="body-2-bold">Remove Validator</Span>: Once your
          validator has fully exited, you can remove it from the SSV Network.
          Keep in mind that you will continue to incur operational fees until
          it's removed, regardless of the validator's state on the Beacon Chain.
        </Text>
        <Button as={Link} to="../.." size="xl">
          Go to Cluster Page
        </Button>
      </Card>
      <Card className="flex-[1] h-fit">
        <ValidatorsBulkSummary publicKeys={selectedPublicKeys} />
      </Card>
    </Container>
  );
};

ExitValidatorsSuccess.displayName = "ExitValidatorsSuccess";
