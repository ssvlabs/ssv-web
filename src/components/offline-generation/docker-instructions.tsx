import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares";
import type { Operator } from "@/types/api";
import { useOperatorsDKGHealth } from "@/hooks/operator/use-operator-dkg-health";
import { LuCheck, LuCopy } from "react-icons/lu";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useSSVAccount } from "@/hooks/use-ssv-account";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useAccount } from "@/hooks/account/use-account";
import { isAddress, parseGwei } from "viem";
import { useCopyToClipboard } from "react-use";
import { stringifyBigints } from "@/lib/utils/bigint";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BigNumberInput, NumberInput } from "@/components/ui/number-input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils/tw";

interface DockerInstructionsProps {
  operators: Operator[];
}

const COMPOUNDING_TOOLTIP =
  "The DKG clients of the selected operators do not support generating compounding validators";

const MIN_EFFECTIVE_BALANCE_GWEI = parseGwei("32");
const MAX_EFFECTIVE_BALANCE_GWEI = parseGwei("2048");

const schema = z.object({
  validators: z.number().int().positive().max(100, {
    message: "You can only generate up to 100 validators",
  }),
  effectiveBalance: z
    .bigint()
    .min(MIN_EFFECTIVE_BALANCE_GWEI, {
      message: "Effective balance must be at least 32 ETH",
    })
    .max(MAX_EFFECTIVE_BALANCE_GWEI, {
      message: "Effective balance cannot exceed 2048 ETH",
    }),
  withdrawalAddress: z.string().refine(isAddress, {
    message: "Invalid Ethereum address",
  }),
  hasConfirmed: z.boolean().refine((val) => val, {
    message: "Please confirm the withdrawal address",
  }),
});

type FormValues = z.infer<typeof schema>;

type Tab = "compounding" | "regular";

const StepBadge: FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-300 shrink-0">
    <Text className="text-xs font-medium text-gray-600 leading-5">{step}</Text>
  </div>
);

export const DockerInstructions: FC<DockerInstructionsProps> = ({
  operators,
}) => {
  const navigate = useNavigate();
  const [copyState, copy] = useCopyToClipboard();
  const { dkgCeremonyState } = useRegisterValidatorContext();

  const account = useAccount();
  const ssvAccount = useSSVAccount();

  const { supportsCompounding, cliVersion } = useOperatorsDKGHealth(operators);

  const [_tab, setTab] = useState<Tab>("compounding");
  const tab: Tab = supportsCompounding ? _tab : "regular";

  const isCompounding = tab === "compounding";

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      validators: dkgCeremonyState.validatorsAmount,
      withdrawalAddress: dkgCeremonyState.withdrawalAddress as Address,
      effectiveBalance: MIN_EFFECTIVE_BALANCE_GWEI,
      hasConfirmed: false,
    },
    resolver: zodResolver(schema),
  });

  const { validators, withdrawalAddress, hasConfirmed, effectiveBalance } =
    form.watch();

  const canGenerateCMD =
    Boolean(ssvAccount.data) &&
    Boolean(account.address) &&
    isAddress(withdrawalAddress) &&
    validators > 0 &&
    hasConfirmed &&
    (!isCompounding || form.formState.isValid);

  const cmd = useQuery({
    queryKey: stringifyBigints([
      "docker-cmd",
      ssvAccount.data,
      account.address,
      validators,
      operators,
      withdrawalAddress,
      cliVersion,
      dkgCeremonyState.selectedOs,
      account.chainId,
      isCompounding,
      effectiveBalance,
    ]),
    queryFn: async () => {
      return generateSSVKeysDockerCMD(
        stringifyBigints({
          operators,
          nonce: ssvAccount.data!.nonce,
          account: account.address!,
          withdrawalAddress: withdrawalAddress as Address,
          chainId: account.chainId,
          version: cliVersion!,
          validatorsCount: validators,
          os: dkgCeremonyState.selectedOs,
          compounding: isCompounding,
          effectiveBalanceGwei: isCompounding ? effectiveBalance : undefined,
        }),
      );
    },
    enabled: canGenerateCMD,
  });

  const submit = form.handleSubmit((data) => {
    useRegisterValidatorContext.state.dkgCeremonyState.validatorsAmount =
      data.validators;
    useRegisterValidatorContext.state.dkgCeremonyState.withdrawalAddress =
      data.withdrawalAddress;

    navigate("../ceremony-summary");
  });

  if (!ssvAccount || !account)
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );

  const helperText = isCompounding
    ? "Maximum effective balance of 2048 ETH"
    : "Maximum effective balance of 32 ETH";

  return (
    <div className="space-y-6 font-medium">
      <Alert variant="default" className="bg-gray-50 border-gray-400">
        <AlertDescription className="text-gray-800 text-sm leading-5">
          Please note that this tool is yet to be audited. Please refrain from
          using it on mainnet.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Text className="text-gray-500 font-semibold">Prerequisite</Text>
        <Text variant="body-2-medium">
          <Button
            as="a"
            variant="link"
            href="https://docs.docker.com/engine/install/"
            target="_blank"
          >
            Docker installed
          </Button>{" "}
          on the machine hosting the DKG client
        </Text>
      </div>

      <div className="space-y-3">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="w-full"
        >
          <TabsList className="w-full h-14 rounded-xl bg-gray-200 border border-gray-300 p-1 gap-1">
            <Tooltip
              triggerProps={{
                className: cn("flex-1", {
                  "cursor-not-allowed": !supportsCompounding,
                }),
              }}
              content={!supportsCompounding ? COMPOUNDING_TOOLTIP : undefined}
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
        <Text className="text-sm text-gray-700">{helperText}</Text>
      </div>

      <Form {...form}>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-100">
            <div className="flex items-center gap-3">
              <StepBadge step={1} />
              <Text className="text-base font-semibold text-gray-700">
                Select how many validators to generate
              </Text>
            </div>
            <div className="flex items-start gap-3">
              <FormField
                control={form.control}
                name="validators"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {isCompounding && (
                      <Text className="text-xs font-semibold text-gray-500 leading-5">
                        Validators
                      </Text>
                    )}
                    <FormControl>
                      <NumberInput
                        max={100}
                        decimals={0}
                        className="bg-white"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isCompounding && (
                <FormField
                  control={form.control}
                  name="effectiveBalance"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                          onChange={field.onChange}
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
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-100">
            <div className="flex items-center gap-3">
              <StepBadge step={2} />
              <Text className="text-base font-semibold text-gray-700">
                Set Withdrawal Address
              </Text>
            </div>
            <FormField
              control={form.control}
              name="withdrawalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        form.setValue("hasConfirmed", false, {
                          shouldValidate: true,
                        });
                        field.onChange(e);
                      }}
                      className="pr-1.5 bg-white"
                      rightSlot={
                        <Button
                          disabled={!isAddress(field.value)}
                          size="sm"
                          variant={hasConfirmed ? "success" : "secondary"}
                          onClick={() =>
                            form.setValue("hasConfirmed", true, {
                              shouldValidate: true,
                            })
                          }
                        >
                          {hasConfirmed && (
                            <LuCheck
                              className="size-4 text-inherit"
                              strokeWidth="3"
                            />
                          )}
                          {hasConfirmed ? "Confirmed" : "Confirm"}
                        </Button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {canGenerateCMD && (
            <div className="space-y-2 pt-3">
              <div className="flex justify-between">
                <Text className="text-base text-gray-700 font-semibold">
                  3. Initiate the DKG ceremony with the following command
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
                      dkgCeremonyState.selectedOs === "windows"
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
                      dkgCeremonyState.selectedOs === "mac"
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
                      dkgCeremonyState.selectedOs === "linux"
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
                    <LuCheck className="size-3 text-inherit" strokeWidth="3" />
                  ) : (
                    <LuCopy className="size-3 text-inherit" strokeWidth="2.5" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <Button
            size="xl"
            className="w-full mt-3"
            disabled={!copyState.value}
            type="submit"
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
};

DockerInstructions.displayName = "DockerInstructions";
