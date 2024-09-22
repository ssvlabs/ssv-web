import { ValidatorsBulkSummary } from "@/components/cluster/validators-bulk-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import {
  getClusterQueryOptions,
  useCluster,
} from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { getRemovedOptimisticValidatorsQueryOptions } from "@/hooks/cluster/use-removed-optimistic-validators";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useBulkRemoveValidator } from "@/lib/contract-interactions/write/use-bulk-remove-validator";
import { useRemoveValidator } from "@/lib/contract-interactions/write/use-remove-validator";
import { setOptimisticData } from "@/lib/react-query";
import { bigintifyNumbers, stringifyBigints } from "@/lib/utils/bigint";
import { formatClusterData } from "@/lib/utils/cluster";
import { sortNumbers } from "@/lib/utils/number";
import { add0x } from "@/lib/utils/strings";
import type { Address } from "abitype";
import { merge } from "lodash-es";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

export const RemoveValidatorsConfirmation: FC = () => {
  const navigate = useNavigate();
  const cluster = useCluster();
  const params = useClusterPageParams();

  const [agree1, setAgree1] = useState(false);
  const { selectedPublicKeys } = useBulkActionContext();

  const removeValidator = useRemoveValidator();
  const bulkRemoveValidators = useBulkRemoveValidator();

  const isPending = removeValidator.isPending || bulkRemoveValidators.isPending;

  const remove = async () => {
    const clusterData = formatClusterData(cluster.data);
    const operatorIds = sortNumbers(
      bigintifyNumbers(cluster.data?.operators ?? []),
    );

    const options = withTransactionModal({
      onMined: ({ events }) => {
        const event = events.find((e) => e.eventName === "ValidatorRemoved");

        setOptimisticData(
          getRemovedOptimisticValidatorsQueryOptions().queryKey,
          (prev) => [...(prev ?? []), ...selectedPublicKeys.map(add0x)],
        );

        setOptimisticData(
          getClusterQueryOptions(params.clusterHash!).queryKey,
          (prev) => {
            if (!prev || !event) return prev;
            return merge(prev, stringifyBigints(event.args.cluster));
          },
        );

        return () => navigate(`/clusters/${params.clusterHash!}`);
      },
    });

    if (selectedPublicKeys.length === 1) {
      return removeValidator.write(
        {
          cluster: clusterData,
          publicKey: selectedPublicKeys[0] as Address,
          operatorIds: operatorIds,
        },
        options,
      );
    }

    bulkRemoveValidators.write(
      {
        cluster: clusterData,
        publicKeys: selectedPublicKeys as Address[],
        operatorIds: bigintifyNumbers(cluster.data?.operators ?? []),
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
      <NavigateBackBtn by="history" />
      <div className="flex w-full gap-6">
        <Card className="flex-[1.7]">
          <Text variant="headline4">Remove validators</Text>
          <Text className="text-gray-600">
            Removing your validator will cause your operators to stop managing
            it in your behalf, which will result in its inactivation (penalties
            on the Beacon Chain).
          </Text>
          <Text className="text-gray-600">
            Please note that this action only applies to its removal from our
            network and does not exit your validator from the Beacon Chain.
          </Text>
          <Alert variant="warning">
            <AlertDescription>
              To avoid slashing, it is advised to wait at least 2 epochs prior
              to running the validator on an alternative service.
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
              I understand that my validator will be removed from the network
              and it will stop attesting on the beacon chain
            </Text>
          </label>
          <Button
            size="xl"
            disabled={!agree1}
            onClick={remove}
            isLoading={isPending}
          >
            Remove validators
          </Button>
        </Card>
        <Card className="flex-[1] h-fit">
          <ValidatorsBulkSummary publicKeys={selectedPublicKeys} />
        </Card>
      </div>
    </Container>
  );
};

RemoveValidatorsConfirmation.displayName = "ExitValidatorsConfirmation";
