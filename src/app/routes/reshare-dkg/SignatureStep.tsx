import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { CompletedBadge } from "@/components/ui/completed-badge.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaCircleInfo } from "react-icons/fa6";
import { DkgAddressInput } from "@/app/routes/reshare-dkg/dkg-address-input.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import type { UseFormReturn } from "react-hook-form";
import type { Address } from "abitype";
import React, { useState } from "react";
import { ReshareSteps } from "@/lib/utils/dkg.ts";
import { useGetWithdrawCredentials } from "@/hooks/operator/useGetWithdrawCredentials.ts";

type Props = {
  form: UseFormReturn<{
    ownerAddress: Address | string;
    withdrawAddress: Address | string;
    signature: string;
  }>;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  currentStep: ReshareSteps;
  isReshare: boolean;
  isMultiSign: boolean;
  isLoading: boolean;
  activateStep: (step: ReshareSteps, callback?: () => void) => void;
  setIsOpenModal: (isOpenModal: boolean) => void;
};

const SignatureStep = ({
  form,
  submit,
  currentStep,
  isReshare,
  isMultiSign,
  activateStep,
  isLoading,
  setIsOpenModal,
}: Props) => {
  const [isOwnerInputDisabled, setIsOwnerInputDisabled] = useState(true);
  const [isWithdrawalInputDisabled, setIsWithdrawalInputDisabled] = useState(
    !!form.watch().withdrawAddress,
  );
  const withdrawAddress = useGetWithdrawCredentials({
    setIsWithdrawalInputDisabled,
    setWithdrawCredentials: (address: string) => {
      form.setValue("withdrawAddress", address);
    },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isSubmitButtonDisabled =
    !isOwnerInputDisabled || !isWithdrawalInputDisabled;

  return (
    <Form {...form}>
      <Card
        onClick={() => {
          activateStep(ReshareSteps.Signature, () => {
            form.reset();
            form.setValue(
              "withdrawAddress",
              withdrawAddress.data?.withdraw_credentials || "",
            );
            setIsWithdrawalInputDisabled(
              !!withdrawAddress.data?.withdraw_credentials,
            );
          });
        }}
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
                You will receive a request in your wallet to approve the changes
                for the DKG resign ceremony. Once all required signatories have
                signed the request, you will need to return to this process and
                provide the final prepared signature from your wallet to
                generate the command that will initiate the resign ceremony.
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
                      <DkgAddressInput
                        field={field}
                        isAcceptedButtonDisabled={
                          !!form.formState.errors.ownerAddress ||
                          (!isMultiSign && isLoading) ||
                          !field.value
                        }
                        isInputDisabled={
                          isOwnerInputDisabled || (!isMultiSign && isLoading)
                        }
                        acceptedButtonLabel={
                          isOwnerInputDisabled ? "Change" : "Save"
                        }
                        setIsInputDisabled={setIsOwnerInputDisabled}
                        value={
                          isOwnerInputDisabled
                            ? shortenAddress(field.value)
                            : field.value
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!withdrawAddress.isLoading &&
              !withdrawAddress.data?.withdraw_credentials && (
                <FormField
                  control={form.control}
                  name="withdrawAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set Withdrawal Address</FormLabel>
                      <FormControl>
                        <DkgAddressInput
                          field={field}
                          isAcceptedButtonDisabled={
                            !!form.formState.errors.withdrawAddress ||
                            (!isMultiSign && isLoading) ||
                            !field.value
                          }
                          isInputDisabled={
                            field.disabled ||
                            (!isMultiSign && isLoading) ||
                            isWithdrawalInputDisabled
                          }
                          acceptedButtonLabel={
                            isWithdrawalInputDisabled ? "Change" : "Confirm"
                          }
                          setIsInputDisabled={setIsWithdrawalInputDisabled}
                          value={field.value}
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
                variant={isSubmitted && isMultiSign ? "secondary" : "default"}
                className={"w-full"}
                onClick={() => isMultiSign && setIsSubmitted(true)}
                disabled={isSubmitButtonDisabled}
                isLoading={
                  withdrawAddress.isLoading || (!isMultiSign && isLoading)
                }
              >
                {!isMultiSign && isLoading
                  ? "Waiting for Confirmation..."
                  : "Sign"}
              </Button>
              {isMultiSign && (
                <Button
                  onClick={() => setIsOpenModal(true)}
                  className={"w-full"}
                  size="xl"
                  variant={isSubmitted ? "default" : "secondary"}
                  disabled={isSubmitButtonDisabled}
                  isLoading={
                    withdrawAddress.isLoading || (!isMultiSign && isLoading)
                  }
                >
                  I Already Have Signatures
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </Form>
  );
};

export default SignatureStep;
