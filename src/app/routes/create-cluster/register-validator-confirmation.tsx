import { getCluster } from "@/api/cluster";
import { ClusterAdditionalFundingSummary } from "@/components/cluster/cluster-additional-funding-summary";
import { ClusterFundingSummary } from "@/components/cluster/cluster-funding-summary";
import { OperatorDetails } from "@/components/operator/operator-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
// import { WithAllowance } from "@/components/with-allowance/with-allowance";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useAccount } from "@/hooks/account/use-account";
import {
  getClusterQueryOptions,
  useCluster,
} from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";
import { useOperators } from "@/hooks/operator/use-operators";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useBulkRegisterValidator } from "@/lib/contract-interactions/write/use-bulk-register-validator";
import { useRegisterValidator } from "@/lib/contract-interactions/write/use-register-validator";
import { track } from "@/lib/analytics/mixpanel";
import { queryClient } from "@/lib/react-query";
import { bigintifyNumbers } from "@/lib/utils/bigint";
import {
  createClusterHash,
  toSolidityCluster,
  getDefaultClusterData,
} from "@/lib/utils/cluster";
import { computeDailyAmount } from "@/lib/utils/keystore";
import { formatSSV } from "@/lib/utils/number";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise";
import type { Address } from "abitype";
import type { FC } from "react";
import { useNavigate } from "react-router";

export const RegisterValidatorConfirmation: FC = () => {
  const inCluster = Boolean(useClusterPageParams().clusterHash);

  const navigate = useNavigate();
  const accountClusters = usePaginatedAccountClusters();

  const account = useAccount();
  const { shares, depositAmount, fundingDays, effectiveBalance } =
    useRegisterValidatorContext();
  const isBulk = shares.length > 1;

  const operatorIds = useSelectedOperatorIds();
  const operators = useOperators(operatorIds);

  const clusterHash = createClusterHash(account.address!, operatorIds);
  const clusterQuery = useCluster(clusterHash, {
    retry: false,
  });

  const registerValidator = useRegisterValidator();
  const bulkRegisterValidator = useBulkRegisterValidator();

  const isPending =
    registerValidator.isPending || bulkRegisterValidator.isPending;

  const handleRegisterValidator = () => {
    const clusterData = clusterQuery.data
      ? toSolidityCluster(clusterQuery.data)
      : getDefaultClusterData();
    const [share] = shares;

    const options = withTransactionModal({
      variant: "2-step",
      onMined: async () => {
        track("Validator Registered", {
          validators_amount: shares.length,
          status: "success",
        });

        await retryPromiseUntilSuccess(() =>
          getCluster(clusterHash)
            .then(
              (cluster) =>
                cluster &&
                clusterData.validatorCount !== cluster?.validatorCount,
            )
            .catch(() => false),
        );

        if (!accountClusters.clusters.length)
          await accountClusters.query.refetch();

        await queryClient.refetchQueries({
          queryKey: getClusterQueryOptions(clusterHash).queryKey,
        });

        return () =>
          navigate(`../success?operatorIds=${operatorIds.join(",")}`);
      },
      onError: (error) => {
        track("Validator Registered", {
          validators_amount: shares.length,
          status: "error",
          error_message: error?.message ?? "unknown error",
        });
      },
    });

    if (shares.length === 1)
      return registerValidator.write(
        {
          amount: depositAmount,
          cluster: clusterData,
          operatorIds: bigintifyNumbers(operatorIds),
          publicKey: share.publicKey as Address,
          sharesData: share.sharesData as Address,
        },
        depositAmount,
        options,
      );

    return bulkRegisterValidator.write(
      {
        amount: depositAmount,
        cluster: clusterData,
        operatorIds: bigintifyNumbers(operatorIds),
        publicKeys: shares.map((share) => share.publicKey as Address),
        sharesData: shares.map((share) => share.sharesData as Address),
      },
      depositAmount,
      options,
    );
  };

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="w-full">
        <div className="flex justify-between w-full">
          <Text variant="headline4">Transaction Details</Text>
          {isBulk && (
            <Badge variant="success">{shares.length} Validators</Badge>
          )}
        </div>
        {shares.length === 1 && (
          <div className="space-y-2">
            <Text variant="body-3-semibold" className="text-gray-500">
              Validator Public Key
            </Text>
            <Input disabled value={shares[0].publicKey} />
          </div>
        )}
        <div className="space-y-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Selected Operators
          </Text>
          {operators.data?.map((operator) => (
            <div className="flex justify-between" key={operator.public_key}>
              <OperatorDetails operator={operator} />
              <div className="text-end space-y-1">
                <Text variant="body-2-medium">
                  {formatSSV(
                    computeDailyAmount(BigInt(operator.eth_fee), fundingDays),
                  )}{" "}
                  ETH
                </Text>
                <Text variant="body-3-medium" className="text-gray-500">
                  /{fundingDays} days
                </Text>
              </div>
            </div>
          ))}
        </div>
        <Divider />
        {inCluster ? (
          <ClusterAdditionalFundingSummary />
        ) : (
          <ClusterFundingSummary
            operators={operators.data ?? []}
            validatorsAmount={shares.length}
            fundingDays={fundingDays}
            effectiveBalance={effectiveBalance}
          />
        )}
        {/*<WithAllowance size="xl" amount={depositAmount}>*/}
        <Button
          size="xl"
          isLoading={isPending}
          isActionBtn
          onClick={handleRegisterValidator}
        >
          Register Validator
        </Button>
        {/*</WithAllowance>*/}
      </Card>
    </Container>
  );
};

RegisterValidatorConfirmation.displayName = "RegisterValidatorConfirmation";
