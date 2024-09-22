import { ValidatorsBulkSummary } from "@/components/cluster/validators-bulk-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useBulkExitValidator } from "@/lib/contract-interactions/write/use-bulk-exit-validator";
import { useExitValidator } from "@/lib/contract-interactions/write/use-exit-validator";
import { bigintifyNumbers } from "@/lib/utils/bigint";
import { sortNumbers } from "@/lib/utils/number";
import type { Address } from "abitype";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

export const ExitValidatorsConfirmation: FC = () => {
  const navigate = useNavigate();
  const cluster = useCluster();

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const { selectedPublicKeys } = useBulkActionContext();

  const exitValidator = useExitValidator();
  const bulkExitValidators = useBulkExitValidator();

  const isPending = exitValidator.isPending || bulkExitValidators.isPending;

  const exit = async () => {
    const operatorIds = sortNumbers(
      bigintifyNumbers(cluster.data?.operators ?? []),
    );

    const options = withTransactionModal({
      onMined: () => {
        return () => navigate(`../success`);
      },
    });

    if (selectedPublicKeys.length === 1) {
      return exitValidator.write(
        {
          publicKey: selectedPublicKeys[0] as Address,
          operatorIds: operatorIds,
        },
        options,
      );
    }

    bulkExitValidators.write(
      {
        publicKeys: selectedPublicKeys as Address[],
        operatorIds: operatorIds,
      },
      options,
    );
  };

  return (
    <Container
      variant="vertical"
      size="xl"
      className="p-6 font-medium w-[1096px]"
    >
      <NavigateBackBtn />
      <div className="flex w-full gap-6">
        <Card className="flex-[1.7]">
          <Text variant="headline4">Exit validators</Text>
          <Text className="text-gray-600">
            Exiting your validator signals to the network that you wish to
            permanently cease your validator's participation in the Beacon Chain
            and retrieve your 32 ETH stake principal.
          </Text>
          <Text className="text-gray-600">
            Initiating an exit places your validator in the exit queue. The
            duration in the queue depends on the number of validators already
            waiting. During this period, your validator must remain active, so
            it is crucial to maintain your validator's performance and keep it
            registered with the SSV network until it has fully exited.
          </Text>
          <Alert variant="warning">
            <AlertDescription>
              Exiting your validator from the Beacon Chain is permanent and
              cannot be reversed, preventing any future reactivation.
            </AlertDescription>
          </Alert>
          <label htmlFor="agree-1" className="flex gap-3 pt-6">
            <Checkbox
              checked={agree1}
              id="agree-1"
              className="mt-1"
              onCheckedChange={(checked: boolean) => setAgree1(checked)}
            />
            <Text>
              I confirm that I have access to the withdrawal credentials of this
              validator.
            </Text>
          </label>
          <label htmlFor="agree-2" className="flex gap-3 pt-6">
            <Checkbox
              checked={agree2}
              id="agree-2"
              className="mt-1"
              onCheckedChange={(checked: boolean) => setAgree2(checked)}
            />
            <Text>
              I understand that my validator must remain active to perform its
              duties while in the exit queue, and it's up to me to remove it
              from the SSV network once completed to stop incurring fees.
            </Text>
          </label>
          <label htmlFor="agree-3" className="flex gap-3 pt-6">
            <Checkbox
              checked={agree3}
              id="agree-3"
              className="mt-1"
              onCheckedChange={(checked: boolean) => setAgree3(checked)}
            />
            <Text>
              I understand that a full exit is an irreversible decision. Once
              completed, the validator permanently leaves the Beacon Chain, and
              this action cannot be undone.
            </Text>
          </label>
          <Button
            size="xl"
            disabled={!agree1 || !agree2 || !agree3}
            onClick={exit}
            isLoading={isPending}
          >
            Exit validators
          </Button>
        </Card>
        <Card className="flex-[1] h-fit">
          <ValidatorsBulkSummary publicKeys={selectedPublicKeys} />
        </Card>
      </div>
    </Container>
  );
};

ExitValidatorsConfirmation.displayName = "ExitValidatorsConfirmation";
