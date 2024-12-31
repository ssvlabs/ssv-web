import { Container } from "@/components/ui/container.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { isAddress } from "viem";
import { Input } from "@/components/ui/input.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { useState } from "react";
import { useReshareSignaturePayload } from "@/hooks/operator/use-reshare-signature-payload.ts";
import { isContractWallet, useAccount } from "@/hooks/account/use-account.ts";
import { useGetWithdrawCredentials } from "@/hooks/operator/useGetWithdrawCredentials.ts";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { Link } from "react-router-dom";
import { CompletedBadge } from "@/components/ui/completed-badge.tsx";
import CeremonySection from "@/app/routes/reshare-dkg/ceremony-section.tsx";
import RemoveValidatorsSection from "@/app/routes/reshare-dkg/remove-validators-section.tsx";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";

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
    message: "Invalid Ethereum address",
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

const ReshareDkg = () => {
  const [currentStep, setCurrentStep] = useState(ReshareSteps.Signature);
  const [isOwnerInputDisabled, setIsOwnerInputDisabled] = useState(true);
  const context = useBulkActionContext();
  const isReshare = context.dkgReshareState.newOperators.length > 0;
  const account = useAccount();
  const withdrawAddress = useGetWithdrawCredentials();
  const reshareContext = useReshareDkg();
  const form = useForm<{
    ownerAddress: Address | string;
    withdrawAddress: Address | string;
    signature: string;
  }>({
    mode: "all",
    defaultValues: {
      ownerAddress: account.address,
      withdrawAddress: withdrawAddress.data?.withdraw_credentials || "",
      signature: "",
    },
    resolver: zodResolver(schema),
  });
  const { clusterHash } = useClusterPageParams();
  const { getSignature, isLoading } = useReshareSignaturePayload(
    form.watch() as {
      ownerAddress: Address;
      withdrawAddress: Address;
      signature: string;
    },
  );
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

  return (
    <Container variant="vertical" size="lg" className="py-5">
      <NavigateBackBtn
        to={`/clusters/${clusterHash}/reshare/select-operators`}
      />
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
                {currentStep > ReshareSteps.Signature && <CompletedBadge />}
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
                      <FormLabel className="flex gap-2 items-center">
                        Owner Address{" "}
                        <Tooltip
                          asChild
                          content={
                            <Button
                              as="a"
                              href="https://docs.ssv.network/~/changes/jp5KZr2yy7T6b0RmeOmN/developers/tools/ssv-dkg-client/update-owner-nonce-in-key-shares"
                              variant="link"
                              target="_blank"
                            >
                              Resign: Update owner address
                            </Button>
                          }
                        >
                          <div>
                            <FaCircleInfo className="size-3 text-gray-500" />
                          </div>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isOwnerInputDisabled || isLoading}
                          value={
                            isOwnerInputDisabled
                              ? shortenAddress(field.value)
                              : field.value
                          }
                          rightSlot={
                            <Button
                              className="border-none text-primary-500 hover:bg-transparent hover:text-primary-500"
                              variant={
                                isOwnerInputDisabled ? "outline" : "secondary"
                              }
                              disabled={!!form.formState.errors.ownerAddress}
                              onClick={() => {
                                if (
                                  form.formState.errors.ownerAddress ||
                                  isLoading
                                ) {
                                  return;
                                }
                                setIsOwnerInputDisabled(!isOwnerInputDisabled);
                              }}
                            >
                              {isOwnerInputDisabled ? "Add" : "Save"}
                            </Button>
                          }
                        />
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
                        <Input
                          {...field}
                          disabled={field.disabled || isLoading}
                        />
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
                  disabled={!form.formState.isValid || !isOwnerInputDisabled}
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
      <CeremonySection
        isEnabled={currentStep === ReshareSteps.Resign}
        isCompletedStep={currentStep > ReshareSteps.Resign}
        isReshare={isReshare}
        selectedOs={context.dkgReshareState.selectedOs}
        ownerAddress={form.watch().ownerAddress as Address}
        withdrawalAddress={form.watch().withdrawAddress as Address}
        signatures={form.watch().signature}
        nextStep={nextStep}
      />
      <RemoveValidatorsSection
        clusterHash={clusterHash || ""}
        isCompletedStep={currentStep > ReshareSteps.Remove}
        isEnabled={currentStep === ReshareSteps.Remove}
        nextStep={nextStep}
        validators={reshareContext.proofsQuery.data?.validators || []}
      />
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
            to={
              isReshare
                ? `/join/validator/keyshares`
                : `/join/validator/${clusterHash}/keyshares`
            }
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
