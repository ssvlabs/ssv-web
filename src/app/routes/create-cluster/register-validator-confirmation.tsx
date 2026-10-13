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
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
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
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";
import { useOperators } from "@/hooks/operator/use-operators";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useBulkRegisterValidator } from "@/lib/contract-interactions/hooks/setter";
import { useRegisterValidator } from "@/lib/contract-interactions/hooks/setter";
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
import { useNavigate } from "react-router-dom";

const UNAVAILABLE_MESSAGE =
  "Couldn't read this value from the network. It will appear once the connection recovers.";

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

  const clusterRunway = useClusterRunway(clusterHash, {
    deltaEffectiveBalance: effectiveBalance,
    deltaBalance: depositAmount,
  });

  // In an existing cluster the funding days are the runway, which is computed
  // from defaulted inputs until its reads have resolved: don't show it before.
  // Idle means the computed cluster isn't there to read, which never resolves
  // on its own: show it as unavailable rather than an endless skeleton.
  const isRunwayUnavailable =
    inCluster && (clusterRunway.isUnavailable || clusterRunway.isIdle);
  const isRunwayLoading =
    inCluster && !isRunwayUnavailable && clusterRunway.isPending;

  const displayFundingDays = inCluster
    ? Number(clusterRunway.data?.runway ?? 0n)
    : fundingDays;

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

        accountClusters.query.refetch();

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
      return registerValidator.write({
        args: {
          cluster: clusterData,
          operatorIds: bigintifyNumbers(operatorIds),
          publicKey: share.publicKey as Address,
          sharesData: share.sharesData as Address,
        },
        value: depositAmount,
        options,
      });

    return bulkRegisterValidator.write({
      args: {
        cluster: clusterData,
        operatorIds: bigintifyNumbers(operatorIds),
        publicKeys: shares.map((share) => share.publicKey as Address),
        sharesData: shares.map((share) => share.sharesData as Address),
      },
      value: depositAmount,
      options,
    });
  };

  return (
    <Container
      data-testid="create-cluster-register-confirmation-page"
      variant="vertical"
      className="py-6"
    >
      <NavigateBackBtn
        data-testid="create-cluster-register-confirmation-back-btn"
        by="history"
      />
      <Card className="w-full">
        <div className="flex justify-between w-full">
          <Text
            data-testid="create-cluster-register-confirmation-title"
            variant="headline4"
          >
            Transaction Details
          </Text>
          {isBulk && (
            <Badge
              data-testid="create-cluster-register-confirmation-validators-count-badge"
              variant="success"
            >
              {shares.length} Validators
            </Badge>
          )}
        </div>
        {shares.length === 1 && (
          <div className="space-y-2">
            <Text variant="body-3-semibold" className="text-gray-500">
              Validator Public Key
            </Text>
            <Input
              data-testid="create-cluster-register-confirmation-pubkey-input"
              disabled
              value={shares[0].publicKey}
            />
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
                {isRunwayUnavailable ? (
                  <Tooltip content={UNAVAILABLE_MESSAGE}>
                    <Text
                      as="span"
                      data-testid="create-cluster-register-confirmation-operator-fee-unavailable"
                      variant="body-2-medium"
                      className="text-error-500"
                    >
                      Unavailable
                    </Text>
                  </Tooltip>
                ) : isRunwayLoading ? (
                  <Skeleton
                    data-testid="create-cluster-register-confirmation-operator-fee-loading"
                    className="ml-auto h-11 w-24"
                  />
                ) : (
                  <>
                    <Text variant="body-2-medium">
                      {formatSSV(
                        computeDailyAmount(
                          BigInt(operator.eth_fee),
                          displayFundingDays,
                        ),
                      )}{" "}
                      ETH
                    </Text>
                    <Text variant="body-3-medium" className="text-gray-500">
                      /{displayFundingDays} days
                    </Text>
                  </>
                )}
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
            fundingDays={fundingDays}
            effectiveBalance={effectiveBalance}
          />
        )}
        {/*<WithAllowance size="xl" amount={depositAmount}>*/}
        <Button
          data-testid="create-cluster-register-confirmation-submit-btn"
          size="xl"
          isLoading={isPending}
          isActionBtn
          // Without the existing cluster's on-chain state the transaction
          // would be sent with a zeroed cluster struct and revert.
          disabled={isRunwayUnavailable || isRunwayLoading}
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
