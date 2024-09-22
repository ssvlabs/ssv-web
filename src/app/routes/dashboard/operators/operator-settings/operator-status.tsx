import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorVisibilityBadge } from "@/components/operator/operator-permission/operator-visibility-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import {
  getOperatorQueryOptions,
  useOperator,
} from "@/hooks/operator/use-operator";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useSetOperatorsPrivateUnchecked } from "@/lib/contract-interactions/write/use-set-operators-private-unchecked";
import { useSetOperatorsPublicUnchecked } from "@/lib/contract-interactions/write/use-set-operators-public-unchecked";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useNavigate } from "react-router";

export const OperatorStatus: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: operator } = useOperator();
  const isFeeZero = !Number(operator?.fee);
  const switchLabel = operator?.is_private ? "Public" : "Private";

  const setOperatorsPrivateUnchecked = useSetOperatorsPrivateUnchecked();
  const setOperatorsPublicUnchecked = useSetOperatorsPublicUnchecked();

  const writer = operator?.is_private
    ? setOperatorsPublicUnchecked
    : setOperatorsPrivateUnchecked;

  if (!operator) return;

  const toggle = () => {
    return writer.write(
      {
        operatorIds: [BigInt(operator.id)],
      },
      withTransactionModal({
        onMined: () => {
          const queryKey = getOperatorQueryOptions(operator.id).queryKey;
          queryClient.cancelQueries({ queryKey });
          queryClient.setQueryData(queryKey, (data) => {
            if (!data) return data;
            return { ...data, is_private: !operator.is_private };
          });
          return () => navigate("..");
        },
      }),
    );
  };

  return (
    <Container variant="vertical" size="lg" className="py-6">
      <NavigateBackBtn />
      <Card>
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Operator Status</h1>
            <div className="flex flex-col gap-3 font-medium text-sm text-gray-700">
              <p>
                Control validator access by switching between public and private
                modes.
              </p>
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-bold">Public mode</span> - Any validator
                  can register with the operator?.
                </li>
                <li>
                  <span className="font-bold">Private mode</span> - Only
                  whitelisted addresses can register.
                </li>
              </ul>
              <p className="font-medium text-sm pt-3">
                Please note that switching to private only impacts future
                validator registrations and will not affect validators that the
                operator already manages.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-6 py-5 rounded-lg">
            <OperatorDetails operator={operator} />
            <OperatorVisibilityBadge isPrivate={operator?.is_private} />
          </div>
          {isFeeZero && operator?.is_private && (
            <Alert variant="error">
              <AlertDescription>
                You cannot switch your operator to public mode when you have a
                set fee of 0.
              </AlertDescription>
            </Alert>
          )}
          <Button
            disabled={isFeeZero && operator?.is_private}
            size="xl"
            className="w-full"
            isLoading={writer.isPending}
            isActionBtn
            onClick={toggle}
          >
            Switch to {switchLabel}
          </Button>
        </div>
      </Card>
    </Container>
  );
};
