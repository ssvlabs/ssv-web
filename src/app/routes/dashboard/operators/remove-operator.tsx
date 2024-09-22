import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useRemoveOperator } from "@/lib/contract-interactions/write/use-remove-operator";
import { setOptimisticData } from "@/lib/react-query";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";

export const RemoveOperator: FC = () => {
  const { operatorId } = useOperatorPageParams();
  const removeOperator = useRemoveOperator();
  const navigate = useNavigate();

  const remove = () =>
    removeOperator.write(
      {
        operatorId: BigInt(operatorId!),
      },
      withTransactionModal({
        onMined: () => {
          setOptimisticData(
            getOperatorQueryOptions(operatorId!).queryKey,
            (prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                is_deleted: true,
              };
            },
          );
          return () => navigate("/operators");
        },
      }),
    );

  const [accepted, setAccepted] = useState(false);

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Card>
        <Text variant="headline4">Remove Operator</Text>
        <Text variant="body-2-medium">
          Removing your operator will cease your operation of all your managed
          validators, which will reduce their fault tolerance and put them at
          risk.
        </Text>
        <Text variant="body-2-medium">
          Immediately stop receiving future earnings from managed validators
          operation.
        </Text>
        <Text variant="body-2-medium">
          Remove yourself from the network and you will not longer be
          discoverable by other validators.
        </Text>
        <Alert variant="error">
          <AlertDescription>
            Please note that this process is irreversible and you would not be
            able to reactive this operator in the future.
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Checkbox
            id="accept"
            checked={accepted}
            onCheckedChange={(checked: boolean) => setAccepted(checked)}
          />
          <Text as="label" htmlFor="accept" variant="body-2-medium">
            I understand that by removing my operator I am potentially putting
            all of my managed validators at risk.
          </Text>
        </div>
        <Button
          variant="destructive"
          size="xl"
          onClick={remove}
          isActionBtn
          isLoading={removeOperator.isPending}
          disabled={!accepted}
        >
          Remove Operator
        </Button>
      </Card>
    </Container>
  );
};

RemoveOperator.displayName = "RemoveOperator";
