import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares";
import type { Operator } from "@/types/api";
import { LuCheck, LuCopy } from "react-icons/lu";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useSSVAccount } from "@/hooks/use-ssv-account";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useAccount } from "@/hooks/account/use-account";
import { isAddress } from "viem";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

interface DockerInstructionsProps {
  operators: Operator[];
}

const schema = z.object({
  validators: z.number().int().positive().max(100, {
    message: "You can only generate up to 100 validators",
  }),
  withdrawalAddress: z.string().refine(isAddress, {
    message: "Invalid Ethereum address",
  }),
  hasConfirmed: z.boolean().refine((val) => val, {
    message: "Please confirm the withdrawal address",
  }),
});

export const DockerInstructions: FC<DockerInstructionsProps> = ({
  operators,
}) => {
  const navigate = useNavigate();

  const [copyState, copy] = useCopyToClipboard();
  const { dkgCeremonyState } = useRegisterValidatorContext();

  const account = useAccount();
  const ssvAccount = useSSVAccount();

  const form = useForm<z.infer<typeof schema>>({
    mode: "all",
    defaultValues: {
      validators: dkgCeremonyState.validatorsAmount,
      withdrawalAddress: dkgCeremonyState.withdrawalAddress as Address,
    },
    resolver: zodResolver(schema),
  });

  const { validators, withdrawalAddress, hasConfirmed } = form.watch();

  const canGenerateCMD =
    ssvAccount.data &&
    account.address &&
    isAddress(withdrawalAddress) &&
    validators > 0 &&
    hasConfirmed;

  const cmd = useQuery({
    queryKey: stringifyBigints([
      "docker-cmd",
      ssvAccount.data,
      account.address,
      validators,
      withdrawalAddress,
      dkgCeremonyState.selectedOs,
    ]),
    queryFn: async () => {
      return generateSSVKeysDockerCMD(
        stringifyBigints({
          operators,
          nonce: ssvAccount.data!.nonce,
          account: account.address!,
          withdrawalAddress: withdrawalAddress as Address,
          chainId: account.chainId,
          validatorsCount: validators,
          os: dkgCeremonyState.selectedOs,
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

  return (
    <div className="space-y-5 font-medium">
      <div className="space-y-3">
        <Text className="text-gray-500 font-semibold">Prerequisite</Text>
        <Text>
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
        <Text className="text-gray-500 font-semibold">Instructions</Text>
        <Form {...form}>
          <form onSubmit={submit} className="space-y-6">
            <FormField
              control={form.control}
              name="validators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base">
                    1. Select how many validators to generate
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="withdrawalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base">
                    2. Set Withdrawal Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="pr-1.5"
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
                              className="size-43 text-inherit"
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

            {canGenerateCMD && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <FormLabel className="text-gray-700 text-base">
                    3. Initiate the DKG ceremony with the following command
                  </FormLabel>
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
            )}

            <Button
              size="xl"
              className="w-full"
              disabled={!copyState.value}
              type="submit"
            >
              Next
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

DockerInstructions.displayName = "DockerInstructions";
