import { Container } from "@/components/ui/container.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { JSONFileUploader } from "@/components/ui/file-upload.tsx";
import { ValidatorsBulkSummary } from "@/components/cluster/validators-bulk-summary.tsx";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { OperatorAvatar } from "@/components/operator/operator-avatar.tsx";
import { cn } from "@/lib/utils/tw.ts";
import { Text } from "@/components/ui/text.tsx";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { ref } from "valtio";
import { KeysharesErrorAlert } from "@/components/keyshares/keyshares-error-alert.tsx";
import { useNavigate } from "react-router-dom";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";

const UploadProofs = () => {
  const navigate = useNavigate();
  const { state } = useBulkActionContext;
  const registerValidatorContext = useRegisterValidatorContext;
  const context = useBulkActionContext();
  const { operators, proofsQuery } = useReshareDkg();

  return (
    <Container
      variant="vertical"
      size="lg"
      className="p-6 font-medium w-[1096px]"
    >
      <NavigateBackBtn to={".."} />
      <div className="flex w-full gap-6">
        <Card className="w-[648px]">
          <CardHeader
            title="Enter proofs.json File"
            description={
              <div>
                Resharing will redistribute your DKG-based validator keyshares
                to a new set of cluster operators. Please upload the proofs.json
                file generated during your validator ceremony to proceed.{" "}
                <Button
                  as="a"
                  href="https://github.com/ssvlabs/ssv-keys/releases"
                  variant="link"
                  target="_blank"
                >
                  What is proofs.json?
                </Button>
              </div>
            }
          />
          <Alert variant="warning" className="flex gap-4 items-center">
            <AlertDescription>
              Resharing is available only for clusters that were generated using
              a DKG ceremony.{" "}
              <Button
                as="a"
                href="https://github.com/ssvlabs/ssv-keys/releases"
                variant="link"
                target="_blank"
              >
                What is DKG resharing?
              </Button>
            </AlertDescription>
          </Alert>
          <JSONFileUploader
            files={context.dkgReshareState.proofFiles.files || []}
            onValueChange={(files) => {
              state.dkgReshareState.proofFiles.files = files ? ref(files) : [];
            }}
            onFileRemoved={() => {
              state.dkgReshareState.proofFiles.files = [];
            }}
            isError={proofsQuery.isError}
            error={<KeysharesErrorAlert error={proofsQuery.error} />}
            isLoading={proofsQuery.isLoading}
            loadingText="Processing proof file..."
          />
          {!proofsQuery.isLoading && proofsQuery.isSuccess && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div>Validators</div>
                <div>{proofsQuery.data?.validators.length}</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>Operators</div>
                <div className="flex flex-row gap-1.5">
                  {operators?.map(({ operator, isUsable }) => (
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
                  ))}
                </div>
              </div>
              <Button
                onClick={() => {
                  state.dkgReshareState.operators = operators.map(
                    ({ operator }) => {
                      registerValidatorContext.state.selectedOperatorsIds = [
                        ...registerValidatorContext.state.selectedOperatorsIds,
                        operator.id,
                      ];
                      return operator;
                    },
                  );

                  navigate("select-operators");
                }}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
        {proofsQuery.isSuccess && proofsQuery.data?.validators && (
          <Card className="flex-[1] h-full">
            <ValidatorsBulkSummary
              publicKeys={
                proofsQuery.data.validators.map(({ publicKey }) => publicKey) ??
                []
              }
            />
          </Card>
        )}
      </div>
    </Container>
  );
};

export default UploadProofs;