import { Container } from "@/components/ui/container.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";
import { LuCheck, LuCopy } from "react-icons/lu";
import CeremonySummary from "@/app/routes/create-cluster/ceremony-summary.tsx";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { isAddress } from "viem";
import { Input } from "@/components/ui/input.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { useState } from "react";
import { useReshareSignaturePayload } from "@/hooks/operator/use-reshare-signature-payload.ts";
import { useQuery } from "@tanstack/react-query";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares.ts";
import { stringifyBigints } from "@/lib/utils/bigint.ts";
import { isContractWallet, useAccount } from "@/hooks/account/use-account.ts";
import { useSSVAccount } from "@/hooks/use-ssv-account.ts";
import { useCopyToClipboard } from "react-use";
import { useGetWithdrawCredentials } from "@/hooks/operator/useGetWithdrawCredentials.ts";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";

enum ReshareSteps {
  Signature = 1,
  Resign = 2,
  Remove = 3,
  Register = 4,
}

const nextStepToMapping: Record<ReshareSteps, ReshareSteps> = {
  [ReshareSteps.Signature]: ReshareSteps.Resign,
  [ReshareSteps.Resign]: ReshareSteps.Remove,
  [ReshareSteps.Remove]: ReshareSteps.Register,
  [ReshareSteps.Register]: ReshareSteps.Signature,
};

const ethereumSignatureRegex = /^(0x([0-9a-fA-F]{130}))+$/;

const addressValidationSchema = z
  .string()
  .refine((value: string) => isAddress(value), {
    message: "Wrong address format",
  });

const schema = z.object({
  ownerAddress: addressValidationSchema,
  withdrawAddress: addressValidationSchema,
  signature: z
    .string()
    .refine((value) => value === "" || ethereumSignatureRegex.test(value), {
      message:
        "Invalid Ethereum signature format. Each signature must start with '0x' and contain 130 hexadecimal characters.",
    }),
});

const ComplitedBadge = () => (
  <div className="flex gap-2 items-center justify-center bg-success-300 text-sm font-medium text-success-500 py-1 px-2 rounded ">
    Completed
    <img className={"size-4"} src={`/images/step-done.svg`} />
  </div>
);

const ReshareDkg = () => {
  const [currentStep, setCurrentStep] = useState(ReshareSteps.Signature);
  const context = useBulkActionContext();
  const isReshare = context.dkgReshareState.newOperators.length > 0;
  const account = useAccount();
  const withdrawAddress = useGetWithdrawCredentials();
  const reshareContext = useReshareDkg();
  const form = useForm<{
    ownerAddress: Address;
    withdrawAddress: Address;
    signature: string;
  }>({
    mode: "all",
    defaultValues: {
      ownerAddress: account.address,
      withdrawAddress: withdrawAddress.data?.withdraw_credentials || "0x",
      signature: "",
    },
    resolver: zodResolver(schema),
  });
  const { clusterHash } = useClusterPageParams();
  const { getSignature, isLoading } = useReshareSignaturePayload(form.watch());
  const [copyState, copy] = useCopyToClipboard();
  const ssvAccount = useSSVAccount();
  const isMultiSign = isContractWallet();

  const nextStep = () => {
    setCurrentStep(nextStepToMapping[currentStep]);
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  const submit = form.handleSubmit(async () => {
    if (form.watch().signature) {
      nextStep();
      setIsOpenModal(false);
      return;
    }
    const signature = await getSignature();
    form.setValue("signature", signature);
    nextStep();
  });

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
        (reshareContext.proofsQuery.data?.validators || []).length > 20
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
          account: account.address!,
          withdrawalAddress: form.watch().withdrawAddress as Address,
          signatures: form.watch().signature.slice(2),
          os: context.dkgReshareState.selectedOs,
          proofsString,
        }),
      );
    },
    enabled: currentStep === ReshareSteps.Resign,
  });

  return (
    <Container variant="vertical" size="lg" className="py-5">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card
          as="form"
          onSubmit={submit}
          className={`border ${currentStep === ReshareSteps.Signature ? "border-primary-500" : ""} w-full`}
        >
          <CardHeader
            title={
              <div className="flex w-full">
                <div className="flex w-full">
                  <Text className="text-primary-500">Step 1:</Text>&nbsp;
                  <Text>Signature</Text>
                </div>
                {currentStep > ReshareSteps.Signature && <ComplitedBadge />}
              </div>
            }
          />
          {currentStep === ReshareSteps.Signature && (
            <div className="flex flex-col gap-4">
              <Text>
                To proceed with the {isReshare ? "reshare" : "resign"} ceremony,
                you must verify ownership by signing the requested changes using
                the wallet identified as your validator's owner address.
              </Text>
              {isMultiSign && (
                <Text>
                  You will receive a request in your wallet to approve the
                  changes for the DKG resign ceremony. Once all required
                  signatories have signed the request, you will need to return
                  to this process and provide the final prepared signature from
                  your wallet to generate the command that will initiate the
                  resign ceremony.
                </Text>
              )}
              {!isReshare && (
                <FormField
                  control={form.control}
                  name="ownerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!withdrawAddress.data?.withdraw_credentials && (
                <FormField
                  control={form.control}
                  name="withdrawAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set Withdrawal Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex flex-row justify-between gap-1.5 w-full">
                <Button
                  type="submit"
                  size="xl"
                  className={"w-full"}
                  disabled={!form.formState.isValid}
                  isLoading={withdrawAddress.isLoading || isLoading}
                >
                  Sign
                </Button>
                {isMultiSign && (
                  <Button
                    onClick={() => setIsOpenModal(true)}
                    className={"w-full"}
                    size="xl"
                    variant="secondary"
                    disabled={!form.formState.isValid}
                    isLoading={withdrawAddress.isLoading || isLoading}
                  >
                    I Already Have Signatures
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </Form>
      <Card
        className={`border ${currentStep === ReshareSteps.Resign ? "border-primary-500" : ""} w-full`}
      >
        <CardHeader
          title={
            <div className="flex w-full">
              <div className="flex w-full">
                <Text className="text-primary-500">Step 2:</Text>&nbsp;
                <Text>{isReshare ? "Reshare" : "Resign"} Validator</Text>
              </div>
              {currentStep > ReshareSteps.Resign && <ComplitedBadge />}
            </div>
          }
          description={
            <div className="flex flex-col gap-6">
              <Text>
                Redistribute your validator's keyshares to a new set of cluster
                operators by starting the{" "}
                {isReshare ? "resharing" : "resigning"} ceremony.
              </Text>
              {currentStep >= ReshareSteps.Resign && (
                <div className="flex flex-col gap-6">
                  {currentStep === ReshareSteps.Resign && (
                    <div className="flex flex-col gap-6">
                      <Text>
                        Make sure{" "}
                        <Button
                          as="a"
                          href="https://github.com/ssvlabs/ssv-keys/releases"
                          variant="link"
                          size="xl"
                          target="_blank"
                        >
                          Docker installed
                        </Button>{" "}
                        on the machine hosting the DKG client
                      </Text>
                      <Alert variant="warning">
                        <AlertDescription>
                          Please ensure you run the provided command from the
                          directory containing the proofs.json file you wish to
                          reshare. For additional details, refer to our{" "}
                          <Button
                            as="a"
                            href="https://github.com/ssvlabs/ssv-keys/releases"
                            variant="link"
                            size="xl"
                            target="_blank"
                          >
                            documentation
                          </Button>{" "}
                          .
                        </AlertDescription>
                      </Alert>
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
                            (useRegisterValidatorContext.state.dkgCeremonyState.selectedOs =
                              "windows")
                          }
                          className="font-bold text-xs h-auto py-1 px-4"
                          variant={
                            context.dkgReshareState.selectedOs === "windows"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          Windows
                        </Button>
                        <Button
                          size="sm"
                          className="font-bold text-xs h-auto py-1 px-4"
                          onClick={() =>
                            (useRegisterValidatorContext.state.dkgCeremonyState.selectedOs =
                              "mac")
                          }
                          variant={
                            context.dkgReshareState.selectedOs === "mac"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          MacOS
                        </Button>
                        <Button
                          size="sm"
                          className="font-bold text-xs h-auto py-1 px-4"
                          onClick={() =>
                            (useRegisterValidatorContext.state.dkgCeremonyState.selectedOs =
                              "linux")
                          }
                          variant={
                            context.dkgReshareState.selectedOs === "linux"
                              ? "secondary"
                              : "outline"
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
                  {currentStep === ReshareSteps.Resign && (
                    <div className="flex flex-col gap-4">
                      <Text>
                        Experiencing issues initiating the ceremony? Explore
                        solutions in the{" "}
                        <Button
                          as="a"
                          href="https://github.com/ssvlabs/ssv-keys/releases"
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
        {currentStep === ReshareSteps.Resign && (
          <Button size="xl" disabled={!copyState.value} onClick={nextStep}>
            DKG Ceremony Initiated
          </Button>
        )}
      </Card>
      <Card
        className={`border ${currentStep === ReshareSteps.Remove ? "border-primary-500" : ""} w-full`}
      >
        <CardHeader
          title={
            <div className="flex">
              <div className="flex w-full">
                <div className="flex w-full">
                  <Text className="text-primary-500">Step 3:</Text>&nbsp;
                  <Text>Remove Validator</Text>
                </div>
                {currentStep > ReshareSteps.Remove && <ComplitedBadge />}
              </div>
            </div>
          }
          description={
            <div className="flex flex-col gap-6">
              <Text>
                To assign your validator to a new cluster, you must first remove
                it from its existing cluster.
              </Text>
              <Text>
                Please note that this action only applies to their removal from
                our network and does not exit your validator from the Beacon
                Chain.
              </Text>
            </div>
          }
        />
        {currentStep === ReshareSteps.Remove && (
          <div className="flex flex-col gap-4">
            <a
              href={`${window.location.origin}/clusters/${clusterHash}/remove/${reshareContext.proofsQuery.data?.validators.map(({ publicKey }) => publicKey).join(",")}`}
              className={"w-full"}
              target="_blank"
            >
              <Button size="xl" className={"w-full"} variant={"secondary"}>
                Remove Selected Validators <FaExternalLinkAlt />
              </Button>
            </a>
            <Button size="xl" onClick={nextStep}>
              My Validator Has Been Removed
            </Button>
          </div>
        )}
      </Card>
      <Card
        className={`border ${currentStep === ReshareSteps.Register ? "border-primary-500" : ""} w-full`}
      >
        <CardHeader
          title={
            <div className="flex">
              <Text className="text-primary-500">Step 4:</Text>&nbsp;
              <Text>Register Validator</Text>
            </div>
          }
          description="Connect with new added owner address or send generated files to the owner to run the validator on the SSV Network by registering and distributing its key shares to your cluster operators."
        />
        {currentStep === ReshareSteps.Register && (
          <Button
            size="xl"
            as={Link}
            to={`/join/validator/${clusterHash}/keyshares`}
          >
            Register Validator
          </Button>
        )}
      </Card>
      {isOpenModal && (
        <div
          style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="relative bg-white rounded-lg shadow-lg w-96">
            <Form {...form}>
              <Card as="form" onSubmit={submit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                      <Text className="font-bold text-xl">
                        Submit Signatures
                      </Text>
                      <button
                        onClick={() => setIsOpenModal(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        &#10005;
                      </button>
                    </div>
                    <Text>Insert the prepared signature hash</Text>
                  </div>
                  <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="xl"
                    className={"w-full"}
                    disabled={
                      !form.formState.isValid || !form.watch().signature
                    }
                    isLoading={withdrawAddress.isLoading || isLoading}
                  >
                    Submit
                  </Button>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ReshareDkg;
