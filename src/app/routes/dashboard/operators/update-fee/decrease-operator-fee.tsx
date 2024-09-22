import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { FeeChange } from "@/components/ui/fee-change";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useReduceOperatorFee } from "@/lib/contract-interactions/write/use-reduce-operator-fee";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { globals } from "@/config";
import { roundOperatorFee } from "@/lib/utils/bigint";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { setOptimisticData } from "@/lib/react-query";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

export const DecreaseOperatorFee: FC = () => {
  const navigate = useNavigate();
  const { operatorId } = useOperatorPageParams();

  const state = useUpdateOperatorFeeContext();
  const reduceOperatorFee = useReduceOperatorFee();

  const submit = () => {
    if (!operatorId) return;

    const blockFee = roundOperatorFee(
      state.newYearlyFee / globals.BLOCKS_PER_YEAR,
    );

    reduceOperatorFee.write(
      {
        operatorId: BigInt(operatorId),
        fee: blockFee,
      },
      withTransactionModal({
        onMined: () => {
          setOptimisticData(
            getOperatorQueryOptions(operatorId).queryKey,
            (operator) => {
              if (!operator) return operator;
              return { ...operator, fee: blockFee.toString() };
            },
          );
          return () => navigate("../success");
        },
      }),
    );
  };

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Card>
        <Text variant="headline4">Update Fee</Text>
        <Text>Your new operator annual fee will be updated to.</Text>
        <FeeChange
          previousFee={state.previousYearlyFee}
          newFee={state.newYearlyFee}
        />
        {state.newYearlyFee === 0n ? (
          <Alert variant="warning">
            <AlertDescription>
              Please note that operators who have set their fee to 0 will not
              have the option to increase or modify their fee in the future.{" "}
              <Button
                as="a"
                variant="link"
                href="https://docs.ssv.network/learn/operators/update-fee"
                target="_blank"
              >
                Read more on fee changes
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="warning">
            <AlertDescription>
              Keep in mind that the process of increasing your fee is different
              than decreasing it, and returning back to your current fee in the
              future would take longer.{" "}
              <Button
                as="a"
                variant="link"
                href="https://docs.ssv.network/learn/operators/update-fee"
                target="_blank"
              >
                Read more on fee changes
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Button
          size="xl"
          isLoading={reduceOperatorFee.isPending}
          onClick={submit}
        >
          Update Fee
        </Button>
      </Card>
    </Container>
  );
};

DecreaseOperatorFee.displayName = "DecreaseOperatorFee";
