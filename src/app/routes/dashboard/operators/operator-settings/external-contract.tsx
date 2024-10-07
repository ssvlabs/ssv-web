import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { globals } from "@/config";
import {
  getOperatorQueryOptions,
  useOperator,
} from "@/hooks/operator/use-operator";
import { fetchIsWhitelistingContract } from "@/lib/contract-interactions/read/use-is-whitelisting-contract";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useRemoveOperatorsWhitelistingContract } from "@/lib/contract-interactions/write/use-remove-operators-whitelisting-contract";
import { useSetOperatorsWhitelistingContract } from "@/lib/contract-interactions/write/use-set-operators-whitelisting-contract";
import { setOptimisticData } from "@/lib/react-query";
import { tryCatch } from "@/lib/utils/tryCatch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { FC } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { isAddress, isAddressEqual, zeroAddress } from "viem";
import { z } from "zod";

type FormValues = {
  externalContract: string;
};

export const ExternalContract: FC = () => {
  const navigate = useNavigate();

  const { data: operator } = useOperator();
  const whitelistingContractAddress =
    operator?.whitelisting_contract !== globals.DEFAULT_ADDRESS_WHITELIST
      ? operator?.whitelisting_contract ?? ""
      : "";

  ({
    contractAddress: whitelistingContractAddress,
  });
  const setExternalContract = useSetOperatorsWhitelistingContract();
  const removeExternalContract = useRemoveOperatorsWhitelistingContract();
  const isPending =
    setExternalContract.isPending || removeExternalContract.isPending;

  const isWhitelistingContract = useMutation({
    mutationFn: fetchIsWhitelistingContract,
  });

  const schema = useMemo(
    () =>
      z.object({
        externalContract: z
          .custom<string>((address) => {
            if (!address) return true;
            return isAddress(address);
          }, "Contract address must be a in a valid address format")
          .refine((address) => {
            if (!address) return true;
            return isWhitelistingContract.mutateAsync({
              contractAddress: address as `0x${string}`,
            });
          }, "Contract is not a compatible whitelisting contract"),
      }) satisfies z.ZodType<FormValues>,
    [isWhitelistingContract],
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      externalContract: whitelistingContractAddress,
    },
    resolver: zodResolver(schema, { async: true }, { mode: "async" }),
  });

  const externalContract = (form.watch("externalContract") ||
    zeroAddress) as `0x${string}`;

  const isChanged = tryCatch(
    () =>
      !isAddressEqual(
        externalContract,
        (operator?.whitelisting_contract || zeroAddress) as `0x${string}`,
      ),
    false,
  );
  const hasErrors = Boolean(form.formState.errors.externalContract);

  const reset = () => {
    form.reset({
      externalContract: whitelistingContractAddress,
    });
  };

  const submit = form.handleSubmit((values) => {
    if (!isChanged || !operator?.id) return;

    const options = withTransactionModal({
      successToast: {
        title: "Transaction confirmed",
        description: new Date().toLocaleString(),
      },
      onMined: () => {
        setOptimisticData(
          getOperatorQueryOptions(operator.id).queryKey,
          (operator) => {
            if (!operator) return operator;
            return {
              ...operator,
              whitelisting_contract: values.externalContract,
            };
          },
        );
        return () => navigate("..");
      },
    });

    if (!values.externalContract) {
      return removeExternalContract.write(
        {
          operatorIds: [BigInt(operator.id)],
        },
        options,
      );
    }

    return setExternalContract.write(
      {
        operatorIds: [BigInt(operator.id)],
        whitelistingContract: values.externalContract as `0x${string}`,
      },
      options,
    );
  });

  return (
    <Container variant="vertical" size="lg" className="py-6">
      <Form {...form}>
        <NavigateBackBtn />
        <Card>
          <form className="flex flex-col gap-8 w-full" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>External Contract</span>
                <Tooltip
                  asChild
                  content={
                    <div>
                      Learn how to set an{" "}
                      <a
                        href="https://docs.ssv.network/operator-user-guides/operator-management/configuring-a-permissioned-operator#adding-an-external-contract"
                        className="link text-primary-500"
                        target="_blank"
                      >
                        External Contract
                      </a>
                    </div>
                  }
                >
                  <div>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </div>
                </Tooltip>
              </h1>
              <p className="text-sm font-medium text-gray-700">
                Delegate the management of whitelisted addresses to an external
                contract.
                <br />
                Whitelisted addresses are effective only when your operator
                status is set to Private.
              </p>
            </div>
            <Alert variant="warning">
              <AlertDescription>
                If you have configured an external contract for managing
                whitelists, both the whitelisted addresses and the external
                contract will apply simultaneously.
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="externalContract"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0xCONT...RACT"
                      rightSlot={
                        field.value && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => field.onChange("")}
                          >
                            <X className="size-5" />
                          </Button>
                        )
                      }
                      leftSlot={
                        isWhitelistingContract.isPending ? (
                          <Spinner />
                        ) : (
                          <IoDocumentTextOutline className="w-6 h-6 text-gray-600" />
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {isChanged && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  disabled={isPending}
                  size="xl"
                  variant="secondary"
                  className="w-full"
                  onClick={reset}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={hasErrors}
                  isLoading={isPending}
                  isActionBtn
                  size="xl"
                  className="w-full"
                >
                  Save
                </Button>
              </div>
            )}
          </form>
        </Card>
      </Form>
    </Container>
  );
};

export default ExternalContract;
