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
import { Input } from "@/components/ui/input.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { useState } from "react";
import { useReshareSignaturePayload } from "@/hooks/operator/use-reshare-signature-payload.ts";
import { useQuery } from "@tanstack/react-query";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares.ts";
import { stringifyBigints } from "@/lib/utils/bigint.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { useSSVAccount } from "@/hooks/use-ssv-account.ts";
import { useCopyToClipboard } from "react-use";

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

const ComplitedBadge = () => (
  <div className="flex gap-2 items-center justify-center bg-success-300 text-sm font-medium text-success-500 py-1 px-2 rounded ">
    Completed
    <img className={"size-4"} src={`/images/step-done.svg`} />
  </div>
);

const ReshareDkg = () => {
  const [currentStep, setCurrentStep] = useState(ReshareSteps.Signature);
  const form = useForm<{ ownerAddress: Address; withdrawAddress: Address }>({
    mode: "all",
    defaultValues: {
      ownerAddress: "0x",
      withdrawAddress: "0x",
    },
  });
  const signaturePayload = useReshareSignaturePayload(form.getValues());
  const account = useAccount();
  const [copyState, copy] = useCopyToClipboard();
  const ssvAccount = useSSVAccount();
  const nextStep = () => {
    setCurrentStep(nextStepToMapping[currentStep]);
  };
  const context = useRegisterValidatorContext();

  const submit = form.handleSubmit((values) => {
    console.log(values);
    nextStep();
  });

  const cmd = useQuery({
    queryKey: stringifyBigints([
      "docker-cmd",
      ssvAccount.data,
      account.address,
      account.chainId,
      context.dkgCeremonyState.selectedOs,
    ]),
    queryFn: async () => {
      return generateSSVKeysDockerCMD(
        stringifyBigints({
          operators: context.dkgReshareState.operators,
          newOperators: context.dkgReshareState.newOperators,
          nonce: ssvAccount.data!.nonce,
          account: account.address!,
          withdrawalAddress: form.getValues().withdrawAddress as Address,
          signatures: "sigbs",
          os: context.dkgCeremonyState.selectedOs,
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
                To proceed with the resign ceremony, you must verify ownership
                by signing the requested changes using the wallet identified as
                your validator's owner address.
              </Text>
              <FormField
                control={form.control}
                name="ownerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Address</FormLabel>
                    <FormControl>
                      <Input
                        // isLoading={ssvAccount.isLoading}
                        // disabled={ssvAccount.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="withdrawAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set Withdrawal Address</FormLabel>
                    <FormControl>
                      <Input
                        // isLoading={ssvAccount.isLoading}
                        // disabled={ssvAccount.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={signaturePayload.isLoading}>
                Sign
              </Button>
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
                <Text>Resign Validator</Text>
              </div>
              {currentStep > ReshareSteps.Resign && <ComplitedBadge />}
            </div>
          }
          description={
            <div className="flex flex-col gap-6">
              <Text>
                Redistribute your validator's keyshares to a new set of cluster
                operators by starting the resigning ceremony.
              </Text>
              {currentStep >= ReshareSteps.Resign && (
                <div className="flex flex-col gap-6">
                  {currentStep === ReshareSteps.Resign && (
                    <Text>
                      Make sure{" "}
                      <Button
                        as="a"
                        href="https://github.com/ssvlabs/ssv-keys/releases"
                        variant="link"
                        target="_blank"
                      >
                        Docker installed
                      </Button>{" "}
                      on the machine hosting the DKG client
                    </Text>
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
                            context.dkgCeremonyState.selectedOs === "windows"
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
                            context.dkgCeremonyState.selectedOs === "mac"
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
                            context.dkgCeremonyState.selectedOs === "linux"
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
          <Button onClick={nextStep}>DKG Ceremony Initiated</Button>
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
            <Button variant={"secondary"}>
              Remove Selected Validators <FaExternalLinkAlt />
            </Button>
            <Button onClick={nextStep}>My Validator Has Been Removed</Button>
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
          <Button>Register Validator</Button>
        )}
      </Card>
    </Container>
  );
};

export default ReshareDkg;
