import { KeysharesErrorAlert } from "@/components/keyshares/keyshares-error-alert";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { JSONFileUploader } from "@/components/ui/file-upload";

import { ValidatorsSelectionTable } from "@/components/cluster/validators-selection-table";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useAccount } from "@/hooks/account/use-account";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useKeysharesValidation } from "@/hooks/keyshares/use-keyshares-validation";
import { useKeysharesValidatorsList } from "@/hooks/keyshares/use-keyshares-validators-state-validation";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability";
import { createClusterHash } from "@/lib/utils/cluster";
import { cn } from "@/lib/utils/tw";
import { useEffect, type ComponentPropsWithoutRef, type FC } from "react";
import { useNavigate } from "react-router";
import { ref } from "valtio";
import { Tooltip } from "@/components/ui/tooltip";

export type GenerateKeySharesOfflineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOfflineProps> &
    GenerateKeySharesOfflineProps
>;

export const UploadKeyshares: FCProps = ({ ...props }) => {
  const account = useAccount();
  const navigate = useNavigate();

  const { state } = useRegisterValidatorContext;
  const context = useRegisterValidatorContext();

  const validatedShares = useKeysharesValidation(context.files?.at(0) || null);
  const operatorIds = useSelectedOperatorIds();

  const { query: validators } = useKeysharesValidatorsList(
    validatedShares.data,
    {
      enabled: validatedShares.isSuccess,
    },
  );

  const cluster = useCluster(createClusterHash(account.address!, operatorIds));
  const operatorsUsability = useOperatorsUsability(
    {
      account: account.address!,
      operatorIds,
      additionalValidators: validators.data?.tags.available.length,
    },
    { enabled: validatedShares.isSuccess },
  );

  const maxAddable = Math.min(
    operatorsUsability.data?.maxAddableValidators ?? 0,
    validators.data?.tags.available.length ?? 0,
  );

  useEffect(() => {
    if (state.selectedValidatorsCount < 1) {
      state.selectedValidatorsCount = maxAddable;
    }
  }, [state, validators.data?.tags.available.length, maxAddable]);

  const submit = () => {
    state.shares =
      validators.data?.tags.available
        .slice(0, context.selectedValidatorsCount)
        .map((share) => share.payload) || [];

    if (cluster.data)
      return navigate(`/join/validator/${cluster.data.clusterId}/funding`);
    navigate("../funding");
  };

  const canProceed =
    Boolean(validators.data?.tags.available.length) &&
    !operatorsUsability.data?.hasExceededValidatorsLimit &&
    !operatorsUsability.data?.hasPermissionedOperators &&
    context.selectedValidatorsCount > 0 &&
    context.selectedValidatorsCount <= maxAddable;

  return (
    <Container
      variant="vertical"
      size={validators.data?.sharesWithStatuses?.length ? "xl" : "default"}
      className="h-full py-6"
    >
      <NavigateBackBtn by="history" />
      <div className="flex gap-6 w-full">
        <Card className="flex-1 h-fit" {...props}>
          <Text variant="headline4">Enter KeyShares File</Text>
          <JSONFileUploader
            files={context.files || []}
            onValueChange={(files) => {
              state.files = files ? ref(files) : null;
            }}
            isError={validatedShares.isError}
            error={<KeysharesErrorAlert error={validatedShares.error} />}
            isLoading={validatedShares.isLoading || validators.isLoading}
            loadingText={
              validatedShares.isLoading
                ? "Validating keyshares..."
                : validators.isLoading
                  ? `Processing ${validatedShares.data?.length} validators...`
                  : undefined
            }
          />

          {validators.data?.sharesWithStatuses.length && (
            <div className="space-y-2">
              <Text variant="body-3-medium" className="text-gray-500">
                Keyshares Summary
              </Text>
              <div className="flex items-center w-full gap-2 justify-between">
                <Text variant="body-2-medium">Validators</Text>
                <Text variant="body-2-medium">
                  {validators.data?.sharesWithStatuses?.length}
                </Text>
              </div>
              <div className="flex gap-2">
                <Text variant="body-2-medium" className="pr-2">
                  Operators
                </Text>
                <Spacer />
                {operatorsUsability.data?.operators?.map(
                  ({ operator, isUsable }) => (
                    <div
                      className="flex flex-1 max-w-8 flex-col items-center"
                      key={operator.id}
                    >
                      <Tooltip content={operator.validators_count}>
                        <OperatorAvatar
                          variant="circle"
                          src={operator.logo}
                          className={cn("border", {
                            "border-error-500": !isUsable,
                            "border-transparent": isUsable,
                          })}
                        />
                      </Tooltip>
                      <Text
                        className={cn("text-[10px] text-gray-500 font-medium", {
                          "text-error-500": !isUsable,
                        })}
                      >
                        ID:{operator.id.toString()}
                      </Text>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {operatorsUsability.data?.hasPermissionedOperators ? (
            <Alert variant="warning">
              <AlertDescription>
                One of your chosen operators is a permissioned operator. Please
                select an alternative operator.
              </AlertDescription>
            </Alert>
          ) : maxAddable < (validators.data?.tags.available.length ?? 0) ? (
            <Alert variant="warning">
              <AlertDescription>
                The number of validators you wish to onboard would exceed the
                maximum validator capacity for one of your selected operators.
                You may proceed with onboarding only {maxAddable} validators.
              </AlertDescription>
            </Alert>
          ) : null}
        </Card>
        {Boolean(validators.data?.sharesWithStatuses?.length) && (
          <Card className="flex-1">
            <div className="flex items-center gap-1 justify-between">
              <Text variant="headline4" className="flex-1">
                Selected Validators
              </Text>
              <div className="flex items-center gap-1 justify-between">
                <Button
                  disabled={context.selectedValidatorsCount <= 1}
                  variant="secondary"
                  onClick={() =>
                    (state.selectedValidatorsCount = Math.max(
                      state.selectedValidatorsCount - 1,
                      1,
                    ))
                  }
                >
                  -
                </Button>
                <Input
                  className="w-16 px-0"
                  inputProps={{ className: "text-center" }}
                  value={context.selectedValidatorsCount}
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (/^\d+$/.test(value)) {
                      const number = Number(value);
                      if (number > maxAddable) {
                        state.selectedValidatorsCount = maxAddable;
                      } else {
                        state.selectedValidatorsCount = number;
                      }
                    }
                  }}
                />
                <Button
                  disabled={context.selectedValidatorsCount === maxAddable}
                  onClick={() =>
                    (state.selectedValidatorsCount = Math.min(
                      state.selectedValidatorsCount + 1,
                      maxAddable,
                    ))
                  }
                  variant="secondary"
                >
                  +
                </Button>
              </div>
            </div>
            {Boolean(validators.data?.tags.incorrect.length) && (
              <Alert variant="error">
                <AlertDescription>
                  Validators within this file have an incorrect{" "}
                  <Button
                    as="a"
                    variant="link"
                    target="_blank"
                    href="https://docs.ssv.network/developers/tools/cluster-scanner#_x7nzjlwu00d0"
                  >
                    registration nonce
                  </Button>
                  . Please split the validator keys to new key shares aligned
                  with the correct one.
                </AlertDescription>
              </Alert>
            )}
            <ValidatorsSelectionTable
              taggedValidators={
                validators.data?.tags || {
                  registered: [],
                  incorrect: [],
                  available: [],
                  all: [],
                }
              }
              sharesWithStatuses={validators.data?.sharesWithStatuses || []}
              selectedAmount={context.selectedValidatorsCount}
            />
            <Button
              isLoading={cluster.isLoading}
              size="xl"
              onClick={submit}
              disabled={!canProceed}
            >
              Next
            </Button>
          </Card>
        )}
      </div>
    </Container>
  );
};

UploadKeyshares.displayName = "GenerateKeySharesOffline";
