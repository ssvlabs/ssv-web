import { OperatorVisibilityBadge } from "@/components/operator/operator-permission/operator-visibility-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Span, Text } from "@/components/ui/text";
import { toast } from "@/components/ui/use-toast";
import { globals } from "@/config";
import { getCreatedOptimisticOperatorsQueryOptions } from "@/hooks/operator/use-created-optimistic-operators";
import { useFocus } from "@/hooks/use-focus";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useRegisterOperator } from "@/lib/contract-interactions/write/use-register-operator";
import { queryClient } from "@/lib/react-query";
import { roundOperatorFee } from "@/lib/utils/bigint";
import { formatBigintInput } from "@/lib/utils/number";
import { createOperatorFromEvent } from "@/lib/utils/operator";
import { shortenAddress } from "@/lib/utils/strings";
import { type FC } from "react";
import { useNavigate } from "react-router";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount } from "@/hooks/account/use-account";
import { useRegisterOperatorContext } from "@/guard/register-operator-guards";

export const RegisterOperatorConfirmation: FC = () => {
  const navigate = useNavigate();

  const { address } = useAccount();
  const { publicKey, yearlyFee, isPrivate } = useRegisterOperatorContext();

  const register = useRegisterOperator();

  const submit = () => {
    register.write(
      {
        setPrivate: isPrivate,
        fee: roundOperatorFee(yearlyFee / globals.BLOCKS_PER_YEAR),
        publicKey: encodeAbiParameters(parseAbiParameters("string"), [
          publicKey,
        ]),
      },
      withTransactionModal({
        onMined: async (receipt) => {
          const event = receipt.events?.find(
            (event) => event.eventName === "OperatorAdded",
          );

          if (!event) {
            toast({
              title: "Operator Added But... 🤔",
              description:
                "You will see the operator in the list after the next block",
            });
            return () => navigate("/operators");
          }

          const operator = createOperatorFromEvent(event);

          queryClient.setQueryData(
            getOperatorQueryOptions(operator.id).queryKey,
            operator,
          );

          queryClient.setQueryData(
            getCreatedOptimisticOperatorsQueryOptions().queryKey,
            (prev) => {
              if (!prev) return [operator];
              return [...prev, operator];
            },
          );

          return () => navigate(`../success?operatorId=${operator.id}`);
        },
      }),
    );
  };

  useFocus("#register-operator-confirmation");

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card
        id="register-operator-confirmation"
        as="form"
        className="w-full"
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            submit();
          }
        }}
        onSubmit={(ev) => {
          ev.preventDefault();
          submit();
        }}
      >
        <Text variant="headline4">Transaction Details</Text>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Owner Address
            </Text>
            <Text variant="body-2-bold">{shortenAddress(address ?? "")}</Text>
          </div>
          <div className="flex justify-between items-center gap-4">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Operator public key
            </Text>
            <Text variant="body-2-bold">
              {" "}
              {shortenAddress(publicKey ?? "")}
            </Text>
          </div>

          <div className="flex justify-between">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Fee
            </Text>
            <div className="flex flex-col gap-0">
              <Text variant="body-2-bold">
                {formatBigintInput(yearlyFee)} SSV{" "}
                <Span variant="body-3-semibold" className="text-gray-500">
                  / year
                </Span>
              </Text>
            </div>
          </div>

          <div className="flex justify-between">
            <Text
              variant="body-2-medium"
              className="font-semibold text-sm text-gray-500"
            >
              Status
            </Text>
            <OperatorVisibilityBadge isPrivate={isPrivate} />
          </div>
        </div>
        <Button
          type="submit"
          size="xl"
          isLoading={register.isPending}
          isActionBtn
        >
          Confirm
        </Button>
      </Card>
    </Container>
  );
};

RegisterOperatorConfirmation.displayName = "RegisterOperatorConfirmation";
