import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { LuCheck, LuCopy } from "react-icons/lu";
import CeremonySummary from "@/app/routes/create-cluster/ceremony-summary.tsx";
import { useQuery } from "@tanstack/react-query";
import { stringifyBigints } from "@/lib/utils/bigint.ts";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares.ts";
import type { Address } from "viem";
import { useAccount } from "@/hooks/account/use-account.ts";
import { useSSVAccount } from "@/hooks/use-ssv-account.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { useCopyToClipboard } from "react-use";
import { CompletedBadge } from "@/components/ui/completed-badge.tsx";

const VALIDATOR_COUNT_THRESHOLD = 20;

const CeremonySection = ({
  isEnabled,
  isCompletedStep,
  isReshare,
  selectedOs,
  ownerAddress,
  withdrawalAddress,
  signatures,
  nextStep,
}: {
  isEnabled: boolean;
  isCompletedStep: boolean;
  isReshare: boolean;
  selectedOs: string;
  ownerAddress: Address;
  withdrawalAddress: Address;
  signatures: string;
  nextStep: () => void;
}) => {
  const account = useAccount();
  const ssvAccount = useSSVAccount();
  const context = useBulkActionContext();
  const reshareContext = useReshareDkg();
  const [copyState, copy] = useCopyToClipboard();

  const cmd = useQuery({
    queryKey: stringifyBigints([
      "docker-cmd",
      ssvAccount.data,
      account.address,
      account.chainId,
      context.dkgReshareState.selectedOs,
    ]),
    queryFn: async () => {
      const proofsString =
        (reshareContext.proofsQuery.data?.validators || []).length >
        VALIDATOR_COUNT_THRESHOLD
          ? undefined
          : JSON.stringify(
              (reshareContext.proofsQuery?.data?.validators || []).map(
                ({ proofs }) => proofs,
              ),
            );

      return generateSSVKeysDockerCMD(
        stringifyBigints({
          operators: context.dkgReshareState.operators,
          newOperators: context.dkgReshareState.newOperators,
          nonce: ssvAccount.data!.nonce,
          account: ownerAddress,
          withdrawalAddress,
          signatures,
          os: context.dkgReshareState.selectedOs,
          proofsString,
        }),
      );
    },
    enabled: isEnabled,
  });

  return (
    <Card className={`border ${isEnabled ? "border-primary-500" : ""} w-full`}>
      <CardHeader
        title={
          <div className="flex w-full">
            <div className="flex w-full">
              <Text className="text-primary-500">Step 2:</Text>&nbsp;
              <Text>{isReshare ? "Reshare" : "Resign"} Validator</Text>
            </div>
            {isCompletedStep && <CompletedBadge />}
          </div>
        }
        description={
          <div className="flex flex-col gap-6">
            <Text>
              Redistribute your validator's keyshares to a new set of cluster
              operators by starting the {isReshare ? "resharing" : "resigning"}{" "}
              ceremony.
            </Text>
            {(isEnabled || isCompletedStep) && (
              <div className="flex flex-col gap-6">
                {isEnabled && (
                  <div className="flex flex-col gap-6">
                    <Text>
                      Make sure{" "}
                      <Button
                        as="a"
                        href="https://docs.docker.com/engine/install"
                        variant="link"
                        size="xl"
                        target="_blank"
                      >
                        Docker is installed
                      </Button>{" "}
                      on the machine hosting the DKG client
                    </Text>
                    {(reshareContext.proofsQuery.data?.validators || [])
                      .length > VALIDATOR_COUNT_THRESHOLD && (
                      <Alert variant="warning">
                        <AlertDescription>
                          Please ensure you run the provided command from the
                          directory containing the proofs.json file you wish to
                          reshare. For additional details, refer to our{" "}
                          <Button
                            as="a"
                            href="https://docs.ssv.network/~/changes/jp5KZr2yy7T6b0RmeOmN/developers/tools/ssv-dkg-client/dkg-tool-commands-and-configuration#additional-flag-for-generate-resign-msg-option"
                            variant="link"
                            size="xl"
                            target="_blank"
                          >
                            documentation
                          </Button>{" "}
                          .
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
                <div>
                  <div className="flex justify-between">
                    <Text className="text-gray-500 text-[14px]">
                      Ceremony Command
                    </Text>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() =>
                          (useBulkActionContext.state.dkgReshareState.selectedOs =
                            "windows")
                        }
                        className="font-bold text-xs h-auto py-1 px-4"
                        variant={
                          selectedOs === "windows" ? "secondary" : "outline"
                        }
                      >
                        Windows
                      </Button>
                      <Button
                        size="sm"
                        className="font-bold text-xs h-auto py-1 px-4"
                        onClick={() =>
                          (useBulkActionContext.state.dkgReshareState.selectedOs =
                            "mac")
                        }
                        variant={selectedOs === "mac" ? "secondary" : "outline"}
                      >
                        MacOS
                      </Button>
                      <Button
                        size="sm"
                        className="font-bold text-xs h-auto py-1 px-4"
                        onClick={() =>
                          (useBulkActionContext.state.dkgReshareState.selectedOs =
                            "linux")
                        }
                        variant={
                          selectedOs === "linux" ? "secondary" : "outline"
                        }
                      >
                        Linux
                      </Button>
                    </div>
                  </div>
                  <div className="flex bg-gray-700 text-gray-50 text-sm p-4 py-2 pr-2 rounded-lg items-center gap-4 w-full overflow-hidden">
                    <Text className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                      {cmd.data}
                    </Text>
                    <Button
                      size="sm"
                      className="h-8"
                      variant={copyState.value ? "success" : "secondary"}
                      onClick={() => copy(cmd.data ?? "")}
                    >
                      <Text>{copyState.value ? "Copied" : "Copy"}</Text>
                      {copyState.value ? (
                        <LuCheck
                          className="size-3 text-inherit"
                          strokeWidth="3"
                        />
                      ) : (
                        <LuCopy
                          className="size-3 text-inherit"
                          strokeWidth="2.5"
                        />
                      )}
                    </Button>
                  </div>
                </div>
                {isEnabled && (
                  <div className="flex flex-col gap-4">
                    <Text>
                      Experiencing issues initiating the ceremony? Explore
                      solutions in the{" "}
                      <Button
                        as="a"
                        href="https://docs.ssv.network/~/changes/jp5KZr2yy7T6b0RmeOmN/developers/tools/ssv-dkg-client/troubleshooting"
                        variant="link"
                        target="_blank"
                      >
                        troubleshooting guide.
                      </Button>
                    </Text>
                    <CeremonySummary isDkgReshareFlow />
                  </div>
                )}
              </div>
            )}
          </div>
        }
      />
      {isEnabled && (
        <Button size="xl" disabled={!copyState.value} onClick={nextStep}>
          DKG Ceremony Initiated
        </Button>
      )}
    </Card>
  );
};

export default CeremonySection;
