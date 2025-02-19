import { Container } from "@/components/ui/container.tsx";
import { Span, Text } from "@/components/ui/text.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import ImgCropUpload from "@/components/ui/ImgCropUpload.tsx";
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
          strategyId: BigInt(createdId),
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
    await wait(0);
    finishTx();
  };

  return (
    <Wizard
      onNext={createStrategyHandler}
      title={"Create Strategy"}
      steps={Object.values(STEPS_LABELS)}
      isLoading={isLoading}
      children={
        <Container variant="horizontal" size="xl" className="py-6">
          <div className="w-[648px] bg-white flex flex-col p-6 rounded-[16px] gap-6">
            <div className="flex flex-col gap-3">
              <Text variant="body-1-bold">Strategy</Text>
              <Text variant="body-2-medium">
                Provide a name and include a short description for your
                strategy.
              </Text>
            </div>
            <Text variant="body-3-semibold">Strategy Name</Text>
            <Input />
            <Text variant="body-3-semibold">Description</Text>
            <Textarea className="h-[169px] resize-none" />
          </div>
          <div className="w-[648px] bg-white flex flex-col p-6 rounded-[16px] gap-6">
            <div className="flex flex-col gap-3">
              <Text variant="body-1-bold">Account</Text>
              <Text variant="body-2-medium">
                Provide an account name and a profile picture.
              </Text>
              <Text variant="body-2-medium">
                These details will show up next to each strategy created by this
                account. You can change your account information at any time in
                My Account.
              </Text>
            </div>
            <Text variant="body-3-semibold">Account Name</Text>
            <Input />
            <Text variant="body-3-semibold">Image</Text>
            <ImgCropUpload
              className="!w-full !h-[166px] !bg-none bg-white"
              value={""}
              setValue={() => console.log(1)}
            ></ImgCropUpload>
          </div>
          {isTxStarted && (
            <DoubleTx
              isLoading={isLoading}
              action={!isLoading ? createStrategyHandler : undefined}
              actionLabel={
                createdStrategyId && createdStrategyRegisteredHash
                  ? "Opt-in to bApp"
                  : "Register"
              }
              stats={txStatus}
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
