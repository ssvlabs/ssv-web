import { IncreaseOperatorFeeStepper } from "@/components/operator/increase-operator-fee/increase-operator-fee-stepper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FeeChange } from "@/components/ui/fee-change";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { globals } from "@/config";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import {
  useOperatorDeclaredFee,
  useOperatorDeclaredFeeStatus,
} from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useCancelDeclaredOperatorFee } from "@/lib/contract-interactions/write/use-cancel-declared-operator-fee";
import { useDeclareOperatorFee } from "@/lib/contract-interactions/write/use-declare-operator-fee";
import { useExecuteOperatorFee } from "@/lib/contract-interactions/write/use-execute-operator-fee";
import { setOptimisticData } from "@/lib/react-query";
import { bigintFloor } from "@/lib/utils/bigint";
import { getYearlyFee } from "@/lib/utils/operator";
import { format } from "date-fns";
import { type FC } from "react";
import { Link } from "react-router-dom";
import { useUnmount } from "react-use";

export const IncreaseOperatorFee: FC = () => {
  const { operatorId } = useOperatorPageParams();

  const operatorFee = useGetOperatorFee({
    operatorId: BigInt(operatorId!),
  });

  const declareOperatorFee = useDeclareOperatorFee();
  const cancelDeclaredOperatorFee = useCancelDeclaredOperatorFee();
  const executeOperatorFee = useExecuteOperatorFee();

  const declaredFee = useOperatorDeclaredFee(BigInt(operatorId!));
  const status = useOperatorDeclaredFeeStatus(BigInt(operatorId!));

  const isCanceled = cancelDeclaredOperatorFee.isSuccess;

  const reset = () => {
    useUpdateOperatorFeeContext.state.newYearlyFee = 0n;
    return declaredFee.reset();
  };

  useUnmount(() => {
    if (isCanceled || status.isApproved) reset();
  });

  const declare = () => {
    declareOperatorFee.write(
      {
        operatorId: BigInt(operatorId!),
        fee: bigintFloor(
          useUpdateOperatorFeeContext.state.newYearlyFee /
            globals.BLOCKS_PER_YEAR,
        ),
      },
      withTransactionModal({
        onMined: async () => {
          declaredFee.refetch();
        },
      }),
    );
  };

  const cancel = () => {
    cancelDeclaredOperatorFee.write(
      { operatorId: BigInt(operatorId!) },
      withTransactionModal(),
    );
  };

  const execute = () => {
    executeOperatorFee.write(
      { operatorId: BigInt(operatorId!) },
      withTransactionModal({
        onMined: async () => {
          setOptimisticData(
            getOperatorQueryOptions(operatorId!).queryKey,
            (prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                fee: declaredFee.data.requestedFee.toString(),
              };
            },
          );
        },
      }),
    );
  };

  const renderButtons = () => {
    if (isCanceled || status.isExpired)
      return (
        <Button
          size="xl"
          isActionBtn
          onClick={() => {
            useUpdateOperatorFeeContext.state.newYearlyFee = 0n;
            return declaredFee.reset();
          }}
          isLoading={cancelDeclaredOperatorFee.isPending}
        >
          Declare New Fee
        </Button>
      );

    if (status.isDeclaration)
      return (
        <Button
          size="xl"
          isActionBtn
          onClick={declare}
          isLoading={declareOperatorFee.isPending}
        >
          Declare Fee
        </Button>
      );

    if (status.isWaiting || status.isPendingExecution) {
      return (
        <div className="flex gap-3">
          <Button
            size="xl"
            className="flex-1"
            variant="secondary"
            onClick={cancel}
            disabled={executeOperatorFee.isPending}
            isLoading={cancelDeclaredOperatorFee.isPending}
          >
            Cancel
          </Button>
          <Button
            size="xl"
            className="flex-1"
            disabled={status.isWaiting}
            onClick={execute}
            isLoading={executeOperatorFee.isPending}
          >
            Execute
          </Button>
        </div>
      );
    }

    return (
      <Button as={Link} to="../.." size="xl">
        Back to my account
      </Button>
    );
  };

  const renderContent = () => {
    if (isCanceled)
      return <Text variant="body-2-medium">Your fee has been canceled</Text>;

    if (status.isDeclaration)
      return (
        <>
          <Text variant="body-2-medium">
            Increasing your operator fee is done in a few steps:
          </Text>
          <Text variant="body-2-medium">
            Process starts by declaring a new fee, which is followed by waiting
            period in which your managed validators are notified. Once the
            waiting period has past you could finalize your new fee by executing
            it.
          </Text>
        </>
      );

    if (status.isWaiting)
      return (
        <Text variant="body-2-medium">
          You have declared a new fee update and your managed validators has
          been notified. Keep in mind that if you do not execute your new fee
          until {format(declaredFee.data.approvalEndTimeMS, "dd MMM")} it will
          expire and you will have to start the process anew.
        </Text>
      );

    if (status.isPendingExecution)
      return (
        <Text variant="body-2-medium">
          Execute your new fee in order to finalize the fee update process.
        </Text>
      );
    if (status.isExpired)
      return (
        <Text variant="body-2-medium">
          Your declare fee has expired because you have not executed it.
        </Text>
      );

    if (status.isApproved)
      return (
        <Text variant="body-2-medium">
          You have successfully updated your fee. The new fee will take effect
          immediately.
        </Text>
      );
  };

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="path" to="../.." />
      <Card className="w-full gap-8">
        <div className="flex gap-3 items-center">
          <Text variant="headline4">Update Fee</Text>
        </div>

        <IncreaseOperatorFeeStepper
          isCanceled={cancelDeclaredOperatorFee.isSuccess}
        />
        {renderContent()}
        <FeeChange
          reversed={isCanceled || status.isExpired}
          previousFee={
            useUpdateOperatorFeeContext.state.previousYearlyFee ||
            getYearlyFee(operatorFee.data ?? 0n)
          }
          newFee={
            useUpdateOperatorFeeContext.state.newYearlyFee ||
            getYearlyFee(declaredFee.data.requestedFee)
          }
        />
        {isCanceled || status.isExpired ? null : (
          <Alert variant="warning">
            <AlertDescription>
              {status.isDeclaration ? (
                <>
                  Not executing or canceling your declared fee will cause it to
                  expire within 10 days.
                  <br />
                  You can always cancel your declared fee (your managed
                  validators will be notified accordingly).
                </>
              ) : (
                <>
                  You can always cancel your declare fee (your managed
                  validators will be notified accordingly).
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
        {renderButtons()}
      </Card>
    </Container>
  );
};

IncreaseOperatorFee.displayName = "IncreaseOperatorFee";
