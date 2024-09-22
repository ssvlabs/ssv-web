import { type FC, type ComponentPropsWithoutRef, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Address } from "viem";
import { isAddress, isAddressEqual } from "viem";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  getSSVAccountQueryOptions,
  useSSVAccount,
} from "@/hooks/use-ssv-account";
import { tryCatch } from "@/lib/utils/tryCatch";
import { useSetFeeRecipientAddress } from "@/lib/contract-interactions/write/use-set-fee-recipient-address";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useAccount } from "@/hooks/account/use-account";
import { setOptimisticData } from "@/lib/react-query";

const schema = z.object({
  feeRecipientAddress: z
    .string()
    .trim()
    .refine(
      isAddress,
      "Invalid address, please input a valid Ethereum wallet address",
    ),
});

export const FeeRecipientAddress: FC<ComponentPropsWithoutRef<"div">> = () => {
  const navigate = useNavigate();
  const ssvAccount = useSSVAccount();
  const account = useAccount();

  const form = useForm<{ feeRecipientAddress: Address }>({
    mode: "all",
    defaultValues: {
      feeRecipientAddress: ssvAccount.data?.recipientAddress,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    form.reset({
      feeRecipientAddress: ssvAccount.data?.recipientAddress,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, ssvAccount.isSuccess]);

  const isChanged = tryCatch(
    () =>
      !isAddressEqual(
        (ssvAccount.data?.recipientAddress ?? "") as Address, // TODO: when there is not clusters, the recipientAddress is undefined, please check with the backend team, we might not need to show this feature if clusters < 1
        form.watch("feeRecipientAddress"),
      ),
    false,
  );

  const setFeeRecipient = useSetFeeRecipientAddress();
  const submit = form.handleSubmit((values) => {
    setFeeRecipient.write(
      {
        recipientAddress: values.feeRecipientAddress,
      },
      withTransactionModal({
        successToast: {
          title: "Fee Recipient Address Updated",
        },
        onMined: () => {
          setOptimisticData(
            getSSVAccountQueryOptions(account.address).queryKey,
            (prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                recipientAddress: values.feeRecipientAddress,
              };
            },
          );
          return () => navigate("/clusters");
        },
      }),
    );
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit}>
          <Text variant="headline4">Fee Recipient Address</Text>
          <Text variant="body-2-medium" className="mt-2">
            Enter an Ethereum address that will receive all of your validators
            block proposal rewards.
            <Button
              as={Link}
              variant="link"
              to="https://docs.ssv.network/learn/introduction"
              target="_blank"
              className="mt-4"
            >
              What are proposal rewards?
            </Button>
          </Text>
          <Alert variant="warning">
            <AlertDescription>
              Standard rewards from performing other duties will remain to be
              credited to your validators balance on the Beacon Chain.
            </AlertDescription>
          </Alert>
          <FormField
            control={form.control}
            name="feeRecipientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Recipient Address</FormLabel>
                <FormControl>
                  <Input
                    isLoading={ssvAccount.isLoading}
                    disabled={ssvAccount.isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="xl"
            isLoading={setFeeRecipient.isPending}
            disabled={!isChanged || !form.formState.isValid}
          >
            Update
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

FeeRecipientAddress.displayName = "FeeRecipientAddress";
