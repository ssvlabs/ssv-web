import { OperatorClusterSizePicker } from "@/components/operator/operator-picker/operator-cluster-size-picker";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { createClusterHash } from "@/lib/utils/cluster";
import { useAccount } from "@/hooks/account/use-account";
import { SelectedOperators } from "@/components/operator/operator-picker/selected-operators";
import { useSearchOperators } from "@/hooks/use-search-operators";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { getYearlyFee } from "@/lib/utils/operator";
import { formatSSV } from "@/lib/utils/number";
import { Divider } from "@/components/ui/divider";
import { SearchInput } from "@/components/ui/search-input";
import { useSearchParamsState } from "@/hooks/app/use-search-param-state";
import { OperatorPickerFilter } from "@/components/operator/operator-picker/operator-picker-filter/operator-picker-filter";
import { useOrdering } from "@/hooks/use-ordering.ts";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { state } = useRegisterValidatorContext;
  const { clusterSize, selectedOperatorsIds } = useRegisterValidatorContext();
  const { orderBy, sort, ordering, handleOrdering } = useOrdering();
  const reshareFlow = useReshareDkg();

  const [search, setSearch, searchDebounced] = useSearchParamsState<string>({
    key: "search",
    initialValue: "",
  });

  const [isVerifiedChecked, setIsVerifiedChecked, isVerifiedCheckedDebounced] =
    useSearchParamsState<"verified_operator" | "">({
      key: "type",
      initialValue: "",
      debounce: 0,
    });

  const [isDKGChecked, setIsDKGChecked, isDKGCheckedDebounced] =
    useSearchParamsState<"true" | "">({
      key: "has_dkg_address",
      initialValue: reshareFlow.operators.length ? "true" : "",
      debounce: 0,
    });

  const { operators, infiniteQuery, fetched } = useSearchOperators({
    search: searchDebounced,
    ordering,
    has_dkg_address: isDKGCheckedDebounced === "true",
    type: isVerifiedCheckedDebounced || undefined,
  });

  const selectedOperators = selectedOperatorsIds
    .map((id) => fetched.operatorsMap[id])
    .filter(Boolean);

  const totalYearlyFee = selectedOperators.reduce(
    (acc, operator) => acc + getYearlyFee(BigInt(operator.fee)),
    0n,
  );

  const hasUnverifiedOperators = selectedOperators.some(
    (operator) => operator.type !== "verified_operator",
  );

  const isClusterSizeMet = selectedOperatorsIds.length === clusterSize;
  const hash = createClusterHash(address!, selectedOperatorsIds);
  const cluster = useCluster(hash, {
    enabled: isClusterSizeMet,
  });

  const isClusterExists =
    reshareFlow.operators.length === 0 &&
    isClusterSizeMet &&
    cluster.isSuccess &&
    cluster.data !== null;

  const nextStep = () => {
    if (
      reshareFlow.operators.some(
        ({ operator }) => !selectedOperatorsIds.includes(operator.id),
      )
    ) {
      reshareFlow.setNewDkgOperators(selectedOperators);
    } else {
      reshareFlow.setNewDkgOperators([]);
    }
    const nextRoute = reshareFlow.operators.length
      ? "../summary"
      : "../distribution-method";
    navigate(nextRoute);
  };

  return (
    <Container variant="vertical" className="py-6 " size="xl">
      <NavigateBackBtn
        onClick={() => {
          useRegisterValidatorContext.resetState();
          useBulkActionContext.state.dkgReshareState.proofFiles.files = [];
        }}
      />
      <div className="flex items-stretch flex-1 gap-6 w-full">
        <Card className={cn(className, "flex flex-col flex-[2.2]")} {...props}>
          <Text variant="headline4">
            Pick the cluster of network operators to run your validator
          </Text>
          <OperatorClusterSizePicker
            value={clusterSize}
            onChange={(size) => (state.clusterSize = size)}
          />
          <div className="flex gap-2">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value as string)}
            />
            <OperatorPickerFilter
              onChange={({ isVerifiedChecked, isDKGChecked }) => {
                setIsVerifiedChecked(
                  isVerifiedChecked ? "verified_operator" : "",
                );
                setIsDKGChecked(isDKGChecked ? "true" : "");
              }}
              isVerifiedChecked={isVerifiedChecked === "verified_operator"}
              isDKGChecked={isDKGChecked === "true"}
            />
          </div>
          <OperatorPicker
            className="flex-1 h-[600px] min-h-[600px]"
            operators={operators}
            query={infiniteQuery}
            orderBy={orderBy}
            sort={sort}
            handleOrdering={handleOrdering}
            maxSelection={clusterSize}
            selectedOperatorIds={selectedOperatorsIds}
            onOperatorCheckedChange={(id) => {
              state.selectedOperatorsIds = xor(selectedOperatorsIds, [id]);
            }}
          />
        </Card>
        <Card className="flex-[1] h-min">
          <SelectedOperators
            className="flex-[1] overflow-auto min-h-[300px]"
            clusterSize={clusterSize}
            selectedOperators={selectedOperators}
            onRemoveOperator={({ id }) => {
              state.selectedOperatorsIds = xor(selectedOperatorsIds, [id]);
            }}
          />
          <Divider />
          <div className="flex justify-between">
            <Text variant="body-2-medium">Operators Yearly Fee</Text>
            <Text variant="body-2-bold">{formatSSV(totalYearlyFee)} SSV</Text>
          </div>
          {hasUnverifiedOperators && (
            <Alert variant="warning">
              <AlertDescription className="flex flex-col gap-4">
                <p className="font-semibold">
                  You have selected one or more operators that are{" "}
                  <Button
                    as="a"
                    variant="link"
                    href="https://docs.ssv.network/learn/operators/verified-operators"
                  >
                    not verified
                  </Button>
                </p>
                <p>
                  Unverified operators that were not reviewed and their identity
                  is not confirmed, may pose a threat to your validators'
                  performance.
                </p>
                <p>
                  Please proceed only if you know and trust these operators.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {isClusterExists && (
            <Alert variant="error">
              <AlertDescription>
                To register an additional validator to this cluster, navigate to
                this{" "}
                <Button
                  as={Link}
                  variant="link"
                  to={`/clusters/${cluster.data?.clusterId}`}
                >
                  cluster page
                </Button>{" "}
                and click “Add Validator”.
              </AlertDescription>
            </Alert>
          )}
          <Button
            size="xl"
            as={Link}
            isLoading={cluster.isLoading}
            disabled={!isClusterSizeMet || isClusterExists}
            onClick={nextStep}
          >
            Next
          </Button>
        </Card>
      </div>
    </Container>
  );
};

SelectOperators.displayName = "SelectOperators";
