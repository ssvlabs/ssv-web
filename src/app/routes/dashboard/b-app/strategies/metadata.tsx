import { Container } from "@/components/ui/container.tsx";
import { Span, Text } from "@/components/ui/text.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useNavigate } from "react-router-dom";
import { Wizard } from "@/components/ui/wizard.tsx";
import { CreateSteps, STEPS_LABELS } from "@/types/b-app.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { useCreateStrategy } from "@/lib/contract-interactions/b-app/write/use-create-strategy.ts";
import { useOptInToBApp } from "@/lib/contract-interactions/b-app/write/use-opt-in-to-b-app.ts";
import { useState } from "react";
import DoubleTx from "@/components/ui/double-tx.tsx";
import { wait } from "@/lib/utils/promise.ts";
import { toast } from "@/components/ui/use-toast.ts";
import { getErrorMessage } from "@/lib/utils/wagmi.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form.tsx";
import { useRequestMetadataByURI } from "@/hooks/b-app/use-request-metadata-by-uri.ts";
import { useUpdateAccountMetadataURI } from "@/lib/contract-interactions/b-app/write/use-update-account-metadata-uri.ts";

const Metadata = () => {
  const navigate = useNavigate();
  const createStrategy = useCreateStrategy();
  const optInToBApp = useOptInToBApp();
  const {
    bApp,
    selectedObligations,
    skippedBApp,
    createdStrategyId,
    createdStrategyRegisteredHash,
  } = useCreateStrategyContext();
  const [isTxStarted, setIsTxStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<
    {
      label: string;
      status: "waiting" | "pending" | "success" | "failed";
      txHash?: `0x${string}`;
    }[]
  >(
    !skippedBApp
      ? [
          { label: "Register Strategy", status: "waiting" },
          { label: "Opt-in to bApp", status: "waiting" },
        ]
      : [{ label: "Register Strategy", status: "waiting" }],
  );
  const [accountMetadataTxState, setAccountMetadataTxState] = useState<{
    label: string;
    status: "waiting" | "pending" | "success" | "failed";
    txHash?: `0x${string}`;
  }>({
    label: "Register Account Metadata",
    status: "waiting",
  });
  const protocolRegex = /^(https?:\/\/)/;
  const urlRegex = /^(https?:\/\/)[\w.-]+\.[a-z]{2,}.*\/[\w.-]+\.json$/i;

  const httpsURLSchema = z
    .string()
    .trim()
    .transform<string>((url) =>
      !protocolRegex.test(url) ? `https://${url}` : url,
    )
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, "Invalid URL")
    .refine(
      (url) => urlRegex.test(url),
      "Invalid URI format. Please ensure the URI ends with “.json",
    );

  const schema = z.object({
    strategyMetadataURI: z.union([z.literal(""), httpsURLSchema]),
    accountMetadataURI: z.union([z.literal(""), httpsURLSchema]),
  });

  const form = useForm({
    mode: "all",
    defaultValues: { strategyMetadataURI: "", accountMetadataURI: "" },
    resolver: zodResolver(schema),
  });
  const { strategyMetadataURI, accountMetadataURI } = form.watch();

  const { strategyMetadata, accountMetadata } = useRequestMetadataByURI({
    strategyMetadata: {
      uri: strategyMetadataURI,
      isValid: !form.formState.errors["strategyMetadataURI"],
    },
    accountMetadata: {
      uri: accountMetadataURI,
      isValid: !form.formState.errors["accountMetadataURI"],
    },
  });
  const updateAccountMetadata = useUpdateAccountMetadataURI();

  const finishTx = () => {
    navigate("/account/strategies");
    setIsLoading(false);
    setIsTxStarted(false);
  };

  const createStrategyHandler = async () => {
    setIsLoading(true);
    let createdId = createdStrategyId;
    let registerHash: `0x${string}` = createdStrategyRegisteredHash;

    const cleanedNumber = Math.round(
      useCreateStrategyContext.state.selectedFee * 100,
    );

    if (createdStrategyId < 0) {
      await createStrategy.write(
        {
          fee: cleanedNumber,
          metadataURI: strategyMetadataURI,
        },
        {
          onError: (e) => {
            setIsLoading(false);
            toast({
              title: "Transaction failed",
              description: (
                <Span className="whitespace-pre-wrap">
                  {getErrorMessage(e)}
                </Span>
              ),
              variant: "destructive",
            });
            setTxStatus(
              !skippedBApp
                ? [
                    {
                      label: "Register Strategy",
                      status: "failed",
                    },
                    { label: "Opt-in to bApp", status: "waiting" },
                  ]
                : [
                    {
                      label: "Register Strategy",
                      status: "failed",
                    },
                  ],
            );
            setIsLoading(false);
          },
          onConfirmed: (hash) => {
            registerHash = hash;
            useCreateStrategyContext.state.createdStrategyRegisteredHash = hash;
            setTxStatus(
              !skippedBApp
                ? [
                    {
                      label: "Register Strategy",
                      status: "pending",
                      txHash: hash,
                    },
                    { label: "Opt-in to bApp", status: "waiting" },
                  ]
                : [
                    {
                      label: "Register Strategy",
                      status: "pending",
                      txHash: hash,
                    },
                  ],
            );
            setIsTxStarted(true);
          },
          onInitiated: () => {
            setTxStatus(
              !skippedBApp
                ? [
                    {
                      label: "Register Strategy",
                      status: "pending",
                    },
                    { label: "Opt-in to bApp", status: "waiting" },
                  ]
                : [
                    {
                      label: "Register Strategy",
                      status: "pending",
                    },
                  ],
            );
            setIsTxStarted(true);
          },
          onMined: (receipt) => {
            toast({
              title: "Transaction confirmed",
              description: new Date().toLocaleString(),
            });
            createdId = parseInt(`${receipt.logs[0].topics[1]}`);
            useCreateStrategyContext.state.createdStrategyId = createdId;
            setTxStatus(
              !skippedBApp
                ? [
                    {
                      label: "Register Strategy",
                      status: "success",
                      txHash: registerHash,
                    },
                    { label: "Opt-in to bApp", status: "waiting" },
                  ]
                : [
                    {
                      label: "Register Strategy",
                      status: "success",
                      txHash: registerHash,
                    },
                  ],
            );
          },
        },
      );
    }

    if (!skippedBApp) {
      const tokens = Object.keys(selectedObligations) as `0x${string}`[];
      const obligationPercentages = [] as number[];
      tokens.forEach((token) => {
        obligationPercentages.push(
          Math.round(selectedObligations[token] * 100),
        );
      });

      await optInToBApp.write(
        {
          strategyId: createdId,
          bApp: bApp.id,
          tokens,
          obligationPercentages,
          data: useCreateStrategyContext.state.registerData || "0x00",
        },
        {
          onError: (e) => {
            setIsLoading(false);
            toast({
              title: "Transaction failed",
              description: (
                <Span className="whitespace-pre-wrap">
                  {getErrorMessage(e)}
                </Span>
              ),
              variant: "destructive",
            });
            setTxStatus([
              {
                label: "Register Strategy",
                status: "success",
                txHash: registerHash,
              },
              { label: "Opt-in to bApp", status: "failed" },
            ]);
          },
          onConfirmed: (hash) => {
            setIsTxStarted(true);
            setTxStatus([
              {
                label: "Register Strategy",
                status: "success",
                txHash: registerHash || "",
              },
              { label: "Opt-in to bApp", status: "pending", txHash: hash },
            ]);
          },
          onInitiated: () => {
            setIsTxStarted(true);
            setTxStatus([
              {
                label: "Register Strategy",
                status: "success",
                txHash: registerHash || "",
              },
              { label: "Opt-in to bApp", status: "pending" },
            ]);
          },
          onMined: (receipt) => {
            toast({
              title: "Transaction confirmed",
              description: new Date().toLocaleString(),
            });
            setTxStatus([
              {
                label: "Register Strategy",
                status: "success",
                txHash: registerHash,
              },
              {
                label: "Opt-in to bApp",
                status: "success",
                txHash: receipt.transactionHash,
              },
            ]);
            return finishTx;
          },
        },
      );
    }

    if (accountMetadataURI) {
      await updateAccountMetadata.write(
        { metadataURI: accountMetadataURI },
        {
          onError: (e) => {
            setIsLoading(false);
            toast({
              title: "Transaction failed",
              description: (
                <Span className="whitespace-pre-wrap">
                  {getErrorMessage(e)}
                </Span>
              ),
              variant: "destructive",
            });
            setAccountMetadataTxState({
              label: "Register Account Metadata",
              status: "failed",
            });
          },
          onConfirmed: (hash) => {
            setIsTxStarted(true);
            setAccountMetadataTxState({
              label: "Register Account Metadata",
              status: "pending",
              txHash: hash,
            });
          },
          onInitiated: () => {
            setIsTxStarted(true);
            setAccountMetadataTxState({
              label: "Register Account Metadata",
              status: "pending",
            });
          },
          onMined: (receipt) => {
            toast({
              title: "Transaction confirmed",
              description: new Date().toLocaleString(),
            });
            setAccountMetadataTxState({
              label: "Register Account Metadata",
              status: "success",
              txHash: receipt.transactionHash,
            });
            return finishTx;
          },
        },
      );
    }
    await wait(0);
    finishTx();
  };
  return (
    <Wizard
      onNext={createStrategyHandler}
      isNextDisabled={!strategyMetadata.isSuccess || !form.formState.isValid}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      isLoading={isLoading}
      children={
        <Container size="xl">
          <Form {...form}>
            <FormField
              control={form.control}
              name="strategyMetadataURI"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col bg-white gap-6 w-full rounded-[16px] p-6 mt-5">
                      <div className="flex flex-col gap-3">
                        <Text variant="body-1-bold">Strategy</Text>
                        <Text variant="body-3-medium">
                          Provide the metadata URI for your strategy.
                        </Text>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Input {...field} placeholder="Enter URI String..." />
                        <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                          <Text
                            className={`${form.formState.errors["strategyMetadataURI"] ? "text-error-500" : "text-gray-500"}`}
                            variant="body-3-medium"
                          >
                            {form.formState.errors["strategyMetadataURI"]
                              ?.message ||
                              (strategyMetadata.isSuccess &&
                              strategyMetadata?.data &&
                              strategyMetadata?.data?.data
                                ? strategyMetadata?.data?.data?.name ||
                                  'Missing "name"'
                                : "Strategy name")}
                          </Text>
                        </div>
                        <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                          <Text
                            className="text-gray-500"
                            variant="body-3-medium"
                          >
                            {strategyMetadata.isSuccess &&
                            strategyMetadata.data &&
                            strategyMetadata.data.data
                              ? strategyMetadata.data.data.description ||
                                'Missing "description"'
                              : "Description"}
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3"></div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountMetadataURI"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col bg-white gap-6 w-full rounded-[16px] p-6 mt-5">
                      <div className="flex flex-col gap-3">
                        <Text
                          className="flex items-center gap-1"
                          variant="body-1-bold"
                        >
                          Account{" "}
                          <Text
                            className="text-gray-500"
                            variant="body-3-medium"
                          >
                            (optional)
                          </Text>
                        </Text>
                        <Text variant="body-3-medium">
                          Provide the metadata URI for your account.
                        </Text>
                        <Text variant="body-3-medium">
                          These details will show up next to each strategy
                          created by this account.
                        </Text>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Input {...field} placeholder="Enter URI String..." />
                        <div className="px-6 py-4 rounded-[12px] bg-gray-100 flex items-center gap-3">
                          <img
                            className="rounded-[8px] size-10 border-gray-400 border"
                            src={
                              form.formState.errors["accountMetadataURI"]
                                ? "/images/no-logo.svg"
                                : accountMetadata.isSuccess &&
                                    accountMetadata?.data?.data
                                  ? accountMetadata?.data?.data?.logo ||
                                    "/images/missing-logo.svg"
                                  : "/images/operator_default_background/light.svg"
                            }
                          />
                          <Text
                            className={`${form.formState.errors["accountMetadataURI"] ? "text-error-500" : "text-gray-500"}`}
                            variant="body-3-medium"
                          >
                            {form.formState.errors["accountMetadataURI"]
                              ?.message ||
                              (accountMetadata.data && accountMetadata.data.data
                                ? accountMetadata.data.data.name ||
                                  'Missing "name"'
                                : "Account Name")}
                          </Text>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3"></div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {isTxStarted && (
              <DoubleTx
                isLoading={isLoading}
                action={!isLoading ? createStrategyHandler : undefined}
                actionLabel={
                  createdStrategyId && createdStrategyRegisteredHash
                    ? "Opt-in to bApp"
                    : "Register"
                }
                stats={
                  accountMetadataURI
                    ? [...txStatus, accountMetadataTxState]
                    : txStatus
                }
                onClose={
                  !isLoading
                    ? () => {
                        setIsLoading(false);
                        setIsTxStarted(false);
                      }
                    : undefined
                }
              />
            )}
          </Form>
        </Container>
      }
      currentStepNumber={CreateSteps.AddMetadata}
      onClose={() => {
        navigate(-1);
      }}
    />
  );
};

export default Metadata;
