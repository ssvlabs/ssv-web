import { getOwnerNonce } from "@/api/account";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { JSONFileUploader } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useOperators } from "@/hooks/operator/use-operators";
import { useCreateShares } from "@/hooks/use-create-shares";
import { useExtractKeystoreData } from "@/hooks/use-extract-keystore-data";
import { useKeystoreValidation } from "@/hooks/use-keystores-validation";
import { prepareOperatorsForShares } from "@/lib/utils/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type ComponentPropsWithoutRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ref } from "valtio";
import { useAccount } from "@/hooks/account/use-account";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import { CiLock } from "react-icons/ci";
import { cn } from "@/lib/utils/tw";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCircleInfo } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type GenerateKeySharesOnlineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOnlineProps> &
    GenerateKeySharesOnlineProps
>;

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const GenerateKeySharesOnline: FCProps = () => {
  const navigate = useNavigate();

  const { address } = useAccount();
  const { state } = useRegisterValidatorContext;
  const { files, password } = useRegisterValidatorContext();

  const form = useForm({
    defaultValues: { password },
    resolver: zodResolver(schema),
  });

  const { status, isError, isLoading } = useKeystoreValidation(
    files?.[0] as File,
  );

  const errors = useMemo(
    () => ({
      "invalid-schema": "Invalid keystore file",
      "validator-registered":
        "Validator is already registered to the network, please try a different keystore file.",
    }),
    [],
  );

  const createShares = useCreateShares();

  const operatorsIds = useSelectedOperatorIds();
  const operators = useOperators(operatorsIds);

  const extractKeystoreData = useExtractKeystoreData({
    onSuccess: async (data) => {
      const nonce = await getOwnerNonce(address!);

      const shares = await createShares.mutateAsync({
        account: address!,
        nonce: nonce,
        operators: prepareOperatorsForShares(operators.data!),
        privateKey: data.privateKey,
      });

      state.shares = [shares];
      navigate("../funding");
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    state.password = data.password;
    await extractKeystoreData
      .mutateAsync({
        file: files![0],
        password: data.password,
      })
      .catch((error) => {
        console.error(error);
        form.setError("password", {
          message: error.message,
        });
      });
  };

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="flex flex-col w-full">
        <Text variant="headline4">Enter Validator Key</Text>
        <Text variant="body-2-medium">
          Upload your validator <b>keystore</b> file below
        </Text>
        <JSONFileUploader
          files={files || []}
          onValueChange={(files) => {
            state.files = files ? ref(files) : null;
          }}
          onFileRemoved={form.reset}
          isError={isError}
          error={errors[status as keyof typeof errors]}
          isLoading={isLoading}
          loadingText="Validating keystore file..."
        />
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-500">
                    Keystore Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={status !== "validator-not-registered"}
                      type="password"
                      className={cn("pl-3", {
                        "bg-gray-300 opacity-70":
                          status !== "validator-not-registered",
                      })}
                      leftSlot={
                        <CiLock
                          className="size-6 mr-2 text-gray-500"
                          strokeWidth="0.5"
                        />
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert variant="warning">
              <AlertDescription className="flex gap-4 items-center">
                <FaCircleInfo className="size-8 text-warning-500" />
                <Text>
                  Please never perform online key splitting on testnet with a
                  private key that you intend to use on mainnet, as doing so may
                  put your validators at risk.
                </Text>
              </AlertDescription>
            </Alert>
            <Button
              size="xl"
              type="submit"
              disabled={
                status !== "validator-not-registered" ||
                !form.watch("password").length
              }
              isLoading={extractKeystoreData.isPending || operators.isPending}
            >
              Generate Key Shares
            </Button>
          </form>
        </Form>
      </Card>
    </Container>
  );
};

GenerateKeySharesOnline.displayName = "GenerateKeySharesOnline";
