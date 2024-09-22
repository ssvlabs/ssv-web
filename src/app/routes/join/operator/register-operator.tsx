import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Span, Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAddress } from "viem";
import { useAccount } from "@/hooks/account/use-account";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@/components/ui/divider";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { getOperatorByPublicKeyQueryOptions } from "@/hooks/operator/use-get-operator-by-public-key";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { OperatorVisibilityBadge } from "@/components/operator/operator-permission/operator-visibility-badge";
import { useNavigate } from "react-router";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useFocus } from "@/hooks/use-focus";
import { useRegisterOperatorContext } from "@/guard/register-operator-guards";

export const RegisterOperator: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const fetchOperatorByPublicKey = useMutation({
    mutationFn: (publicKey: string) =>
      queryClient.fetchQuery(getOperatorByPublicKeyQueryOptions(publicKey)),
  });

  const schema = z.object({
    owner: z.string().trim().refine(isAddress).readonly(),
    isPrivate: z.boolean().optional().default(false),
    publicKey: z
      .string()
      .trim()
      .superRefine(async (v, ctx) => {
        if (!/^[A-Za-z0-9]{612}$/.test(v))
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid public key",
          });

        const { data } = await fetchOperatorByPublicKey.mutateAsync(v);
        if (data) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Operator already registered",
          });
        }
      }),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      owner: address,
      publicKey: useRegisterOperatorContext.state.publicKey,
      isPrivate: useRegisterOperatorContext.state.isPrivate,
    },
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit((values) => {
    useRegisterOperatorContext.state.isPrivate = values.isPrivate;
    useRegisterOperatorContext.state.publicKey = values.publicKey;
    navigate("../fee");
  });

  useFocus("#register-operator-public-key");

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn>Join the SSV Network Operators</NavigateBackBtn>

      <Form {...form}>
        <Card as="form" onSubmit={submit} className={cn(className)} {...props}>
          <Text variant="headline4">Register Operator</Text>
          <Text>
            Register to the networks registry to enable others to discover and
            select you as one of their validator's operators.
          </Text>

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <Tooltip content="The operator's admin address for management purposes.">
                  <FormLabel className="flex gap-1 items-center">
                    <Text>Owner Address</Text>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </FormLabel>
                </Tooltip>
                <FormControl>
                  <Input disabled className="bg-gray-300" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicKey"
            render={({ field }) => (
              <FormItem>
                <Tooltip
                  content={
                    <Text>
                      Generated as part of the SSV node setup - see our{" "}
                      <Button
                        variant="link"
                        as="a"
                        href="https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys"
                        target="_blank"
                      >
                        documentation{" "}
                      </Button>
                    </Text>
                  }
                >
                  <FormLabel className="flex gap-1 items-center">
                    <Text>Operator Public Key</Text>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </FormLabel>
                </Tooltip>

                <FormControl>
                  <Input
                    id="register-operator-public-key"
                    {...field}
                    isLoading={fetchOperatorByPublicKey.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Divider />
          <div className="flex justify-between items-center">
            <Tooltip
              content={
                <div className="space-y-6">
                  <Span variant="body-3-bold">Public Mode</Span>- Any validator
                  can register with the operator.
                  <br />
                  <Span variant="body-3-bold">Private Mode</Span> - Only
                  whitelisted addresses can register.
                  <div>
                    Please note that you can always modify the operator status
                    in the future. Learn more about{" "}
                    <Button
                      variant="link"
                      as="a"
                      href="https://docs.ssv.network/learn/operators/permissioned-operators"
                      target="_blank"
                    >
                      Permissioned Operators.
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="flex gap-2 items-center">
                <Text variant="body-1-bold">Operator Status</Text>
                <FaCircleInfo className="size-4 text-gray-500" />
              </div>
            </Tooltip>
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <OperatorVisibilityBadge
                        isPrivate={form.watch("isPrivate")}
                      />
                      <Switch
                        checked={form.watch("isPrivate")}
                        id="airplane-mode"
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button size="xl" type="submit">
            Register Operator
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

RegisterOperator.displayName = "RegisterOperator";
