import { type FC, type ComponentPropsWithoutRef } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/components/ui/text";
import { NumberInput } from "@/components/ui/number-input";
import { formatUnits, parseEther } from "viem";
import { globals } from "@/config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useFocus } from "@/hooks/use-focus";
import { useRegisterOperatorContext } from "@/guard/register-operator-guards";
import { Alert, AlertDescription } from "@/components/ui/alert";

const minimumFee =
  globals.BLOCKS_PER_YEAR * globals.MINIMUM_OPERATOR_FEE_PER_BLOCK;

export const SetOperatorFee: FC<ComponentPropsWithoutRef<"div">> = () => {
  const navigate = useNavigate();
  const { isPrivate } = useRegisterOperatorContext();

  const form = useForm({
    mode: "all",
    defaultValues: {
      yearlyFee: useRegisterOperatorContext.state.yearlyFee ?? "",
    },
    resolver: zodResolver(
      z.object({
        yearlyFee: z.bigint().superRefine((value, ctx) => {
          if (value > parseEther("200")) {
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Fee must be lower than 200 SSV",
            });
          }
          if (isPrivate && value === parseEther("0")) return;

          if (value === parseEther("0"))
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee cannot be set to 0 while operator status is set to public. To set the fee to 0, switch the operator status to private in the previous step.`,
            });

          if (value >= parseEther("0") && value < minimumFee)
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee must be greater than ${formatUnits(minimumFee, 18)} SSV`,
            });
        }),
      }),
    ),
  });

  const submit = form.handleSubmit((values) => {
    useRegisterOperatorContext.state.yearlyFee = values.yearlyFee;
    navigate("../confirm-transaction");
  });

  useFocus("#register-operator-fee", { select: true });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit}>
          <Text variant="headline4">Set Operator Fee</Text>
          <Text>
            The ssv network utilizes the SSV token to facilitate payments
            between stakers to operators for maintaining their validators.
          </Text>
          <Text>
            Operators set their own fees, denominated in SSV tokens, to be
            charged per each validator that selects them as one of their
            operators.
          </Text>
          <Text>
            Fees are presented as annual payments, but in practice are paid to
            operators continuously as an ongoing process - per each passed
            block.
          </Text>
          <Text>
            Your earnings are paid to your ssv operator balance, and can be
            withdrawn to your wallet at any time.
          </Text>
          <Text>
            Please note that you could always change your fee (according to the{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/learn/operators/update-fee"
              target="_blank"
              variant="link"
            >
              limitations
            </Button>
            ) to align with market dynamics, such as competitiveness and SSV
            price fluctuations.
          </Text>

          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Annual fee</FormLabel>
                <FormControl>
                  <NumberInput
                    displayDecimals={7}
                    id="register-operator-fee"
                    value={field.value}
                    onChange={field.onChange}
                    max={parseEther("200")}
                    rightSlot={
                      <div className="flex items-center gap-1 px-3">
                        <img
                          src="/images/ssvIcons/logo.svg"
                          className="size-5"
                        />
                        <Text variant="body-2-bold">SSV</Text>
                      </div>
                    }
                  />
                </FormControl>
                {fieldState.error?.message && (
                  <Alert variant="error">
                    <AlertDescription>
                      {fieldState.error?.message}
                    </AlertDescription>
                  </Alert>
                )}
                {isPrivate && form.watch("yearlyFee") === 0n && (
                  <Alert variant="warning">
                    <AlertDescription>
                      If you set your fee to 0 you will not be able to change it
                      in the future
                    </AlertDescription>
                  </Alert>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" size="xl">
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

SetOperatorFee.displayName = "SetOperatorFee";
