import { Container } from "@/components/ui/container.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { getAddress, isAddress } from "viem";
import { Input } from "@/components/ui/input.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { useState } from "react";
import { useReshareSignaturePayload } from "@/hooks/operator/use-reshare-signature-payload.ts";
import { isContractWallet, useAccount } from "@/hooks/account/use-account.ts";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params.ts";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReshareDkg } from "@/hooks/use-reshare-dkg.ts";
import { Link } from "react-router-dom";
import CeremonySection from "@/app/routes/reshare-dkg/ceremony-section.tsx";
import RemoveValidatorsSection from "@/app/routes/reshare-dkg/remove-validators-section.tsx";
import { useMultisigTransactionModal } from "@/signals/modal.ts";
import SignatureStep from "@/app/routes/reshare-dkg/SignatureStep.tsx";
import { ReshareSteps } from "@/lib/utils/dkg.ts";
import { useCopyToClipboard } from "react-use";

const nextStepToMapping: Record<ReshareSteps, ReshareSteps> = {
  [ReshareSteps.Signature]: ReshareSteps.Resign,
  [ReshareSteps.Resign]: ReshareSteps.Remove,
  [ReshareSteps.Remove]: ReshareSteps.Register,
  [ReshareSteps.Register]: ReshareSteps.Signature,
};

const ethereumSignatureRegex = /^(0x([0-9a-fA-F]{130,}))+$/;

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
      message: "Invalid format. Please enter a valid signature hash.",
    }),
});

const ReshareDkg = () => {
  const [currentStep, setCurrentStep] = useState(ReshareSteps.Signature);
  const context = useBulkActionContext();
  const isReshare = context.dkgReshareState.newOperators.length > 0;
  const account = useAccount();
  const reshareContext = useReshareDkg();
  const [copyState, copy] = useCopyToClipboard();

  const form = useForm<{
    ownerAddress: Address | string;
    withdrawAddress: Address | string;
    signature: string;
  }>({
    mode: "all",
    defaultValues: {
      ownerAddress: account.address,
      withdrawAddress: "",
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
    isMultiSign && useMultisigTransactionModal.state.open();
    const signature = await getSignature();
    form.setValue("signature", signature);
    isMultiSign && useMultisigTransactionModal.state.close();
    copy("");
    nextStep();
  });

  const activateStep = (step: ReshareSteps, callBack?: () => void) => {
    currentStep > step && callBack && callBack();
    currentStep > step && setCurrentStep(step);
  };

  const isResignedOwnerAddress =
    currentStep > ReshareSteps.Signature &&
    account.address !== getAddress(form.watch().ownerAddress || "0x");

  return (
    <Container variant="vertical" size="lg" className="py-5">
      <NavigateBackBtn
        to={`/clusters/${clusterHash}/reshare/select-operators`}
      />
      <SignatureStep
        activateStep={activateStep}
        currentStep={currentStep}
        form={form}
        isLoading={isLoading}
        isMultiSign={isMultiSign}
        isReshare={isReshare}
        setIsOpenModal={setIsOpenModal}
        submit={submit}
      />
      <CeremonySection
        copyState={copyState}
        copy={copy}
        activateStep={activateStep}
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
        activateStep={() => {
          activateStep(ReshareSteps.Remove);
        }}
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
              isResignedOwnerAddress
                ? "/clusters"
                : isReshare
                  ? `/join/validator/keyshares`
                  : `/join/validator/${clusterHash}/keyshares`
            }
          >
            {isResignedOwnerAddress ? "Go to My Account" : "Register Validator"}
          </Button>
        )}
      </Card>
      {isOpenModal && (
        <div
          style={{ backgroundColor: "rgba(11, 42, 60, 0.16)" }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="relative rounded-lg shadow-lg w-96">
            <Form {...form}>
              <Card as="form" onSubmit={submit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                      <Text className="font-bold text-xl">
                        Submit Signatures
                      </Text>
                      <button
                        onClick={() => {
                          setIsOpenModal(false);
                          form.resetField("signature");
                        }}
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
