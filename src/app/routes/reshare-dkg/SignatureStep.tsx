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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { BigNumberInput } from "@/components/ui/number-input.tsx";
import { FaCircleInfo } from "react-icons/fa6";
import { DkgAddressInput } from "@/app/routes/reshare-dkg/dkg-address-input.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import type { UseFormReturn } from "react-hook-form";
import type { Address } from "abitype";
import React, { useState, type FC } from "react";
import { ReshareSteps } from "@/lib/utils/dkg.ts";
import { useGetWithdrawCredentials } from "@/hooks/operator/useGetWithdrawCredentials.ts";
import { cn } from "@/lib/utils/tw.ts";
import { parseGwei } from "viem";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";

const COMPOUNDING_TOOLTIP =
  "The DKG clients of the selected operators do not support generating compounding validators";

export const MAX_EFFECTIVE_BALANCE_GWEI = parseGwei("2048");

export type ReshareTab = "compounding" | "regular";

const StepBadge: FC<{ step: number }> = ({ step }) => (
  <div className="size-7 flex items-center justify-center rounded-lg bg-white border border-gray-300 shrink-0">
    <Text className="text-xs font-medium text-gray-600 leading-5">{step}</Text>
  </div>
);

type Props = {
  form: UseFormReturn<{
    ownerAddress: Address | string;
    withdrawAddress: Address | string;
    signature: string;
    effectiveBalance: bigint;
  }>;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  currentStep: ReshareSteps;
  isReshare: boolean;
  isMultiSign: boolean;
  isLoading: boolean;
  activateStep: (step: ReshareSteps, callback?: () => void) => void;
  setIsOpenModal: (isOpenModal: boolean) => void;
  supportsCompounding: boolean;
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
  supportsCompounding,
}: Props) => {
  const ctx = useBulkActionContext();
  const compounding = ctx.dkgReshareState.compounding && supportsCompounding;
  const tab: ReshareTab = compounding ? "compounding" : "regular";
  const setTab = (next: ReshareTab) => {
    useBulkActionContext.state.dkgReshareState.compounding =
      next === "compounding";
  };

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

  const isCompounding = compounding;
  const helperText = isCompounding
    ? "Maximum effective balance of 2048 ETH. Only whole numbers can be entered."
    : "Maximum effective balance of 32 ETH";

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
                            href="https://docs.ssv.network/developers/tools/ssv-dkg-client/update-owner-nonce-in-key-shares"
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
            <div className="flex flex-col gap-3">
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as ReshareTab)}
                className="w-full"
              >
                <TabsList className="w-full h-14 rounded-xl bg-gray-200 border border-gray-300 p-1 gap-1">
                  <Tooltip
                    triggerProps={{
                      className: cn("flex-1", {
                        "cursor-not-allowed": !supportsCompounding,
                      }),
                    }}
                    content={
                      !supportsCompounding ? COMPOUNDING_TOOLTIP : undefined
                    }
                  >
                    <TabsTrigger
                      value="compounding"
                      disabled={!supportsCompounding}
                      className={cn(
                        "flex-1 h-full rounded-lg text-base font-semibold text-gray-500",
                        "data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=active]:shadow-sm",
                        "disabled:opacity-50 disabled:pointer-events-none",
                      )}
                    >
                      Compounding
                    </TabsTrigger>
                  </Tooltip>
                  <TabsTrigger
                    value="regular"
                    className={cn(
                      "flex-1 h-full rounded-lg text-base font-semibold text-gray-500",
                      "data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=active]:shadow-sm",
                    )}
                  >
                    Regular Withdrawals
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Text variant="body-3-medium">{helperText}</Text>
            </div>

            {isCompounding && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-100">
                <div className="flex items-center gap-3">
                  <StepBadge step={1} />
                  <Text className="text-sm font-semibold text-gray-700 leading-5">
                    Select how many validators to generate
                  </Text>
                </div>
                <FormField
                  control={form.control}
                  name="effectiveBalance"
                  render={({ field }) => (
                    <FormItem>
                      <Text className="text-xs font-semibold text-gray-500 leading-5">
                        Effective Balance
                      </Text>
                      <FormControl>
                        <BigNumberInput
                          max={MAX_EFFECTIVE_BALANCE_GWEI}
                          decimals={9}
                          displayDecimals={0}
                          className="bg-white"
                          value={field.value}
                          onChange={(value) =>
                            form.setValue("effectiveBalance", value)
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          rightSlot={
                            <div className="flex items-center gap-1 pr-2">
                              <img
                                alt="ETH"
                                src="/images/networks/dark.svg"
                                className="size-5"
                              />
                              <Text className="text-base font-medium text-gray-800">
                                ETH
                              </Text>
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!withdrawAddress.isLoading &&
              !withdrawAddress.data?.withdraw_credentials && (
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-100">
                  <div className="flex items-center gap-3">
                    <StepBadge step={isCompounding ? 2 : 1} />
                    <Text className="text-base font-semibold text-gray-700 leading-6">
                      Set Withdrawal Address
                    </Text>
                  </div>
                  <FormField
                    control={form.control}
                    name="withdrawAddress"
                    render={({ field }) => (
                      <FormItem>
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
                </div>
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
