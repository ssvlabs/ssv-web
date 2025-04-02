import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { BigNumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { useOperator } from "@/hooks/operator/use-operator";
import { useOperatorFeeLimits } from "@/hooks/operator/use-operator-fee-limits";
import { useOperatorDeclaredFee } from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { isBigIntChanged } from "@/lib/utils/bigint";
import { formatBigintInput } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useForm } from "react-hook-form";
import { FaCircleInfo } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { formatUnits } from "viem";
import { z } from "zod";

export const UpdateOperatorFee: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { operatorId } = useOperatorPageParams();
  const navigate = useNavigate();

  const { min, max, isLoading, operatorYearlyFee } = useOperatorFeeLimits();
  const { data: operator } = useOperator();

  const schema = z.object({
    yearlyFee: z.bigint().superRefine((value, ctx) => {
      if (operator?.is_private && value === 0n) return;
      if (!operator?.is_private && value === 0n) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `You must set your operator as private before updating your fee to 0.`,
        });
      }

      if (value < min) {
        return ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: min,
          type: "bigint",
          inclusive: true,
          message: `Fee must be at least ${formatUnits(min, 18)} SSV`,
        });
      }
      if (value > max) {
        return ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: max,
          type: "bigint",
          inclusive: true,
          message: `You can only increase your fee up to ${formatUnits(max, 18)} SSV`,
        });
      }
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      yearlyFee: operatorYearlyFee,
    },
  });

  const hasErrors = Boolean(form.formState.errors.yearlyFee);

  const declaredOperatorFee = useOperatorDeclaredFee(BigInt(operatorId!));

  const submit = form.handleSubmit((values) => {
    useUpdateOperatorFeeContext.state.previousYearlyFee = operatorYearlyFee;
    useUpdateOperatorFeeContext.state.newYearlyFee = values.yearlyFee;

    const isIncreased = values.yearlyFee > operatorYearlyFee;
    declaredOperatorFee.reset();
    return navigate(isIncreased ? "../increase" : "../decrease");
  });

  const isChanged = isBigIntChanged(form.watch("yearlyFee"), operatorYearlyFee);

  return (
    <Container variant="vertical" className={cn(className, "py-6")} {...props}>
      <NavigateBackBtn by="path" to="../.." />
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={submit}>
          <CardHeader
            title="Update Fee"
            description="Enter your new operator annual fee."
          />
          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <BigNumberInput
                    max={max}
                    placeholder=""
                    {...field}
                    render={(props, ref) => (
                      <div className="flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-gray-300 bg-gray-200">
                        <div className="flex h-14 items-center gap-5">
                          <input
                            placeholder="0"
                            className="w-full h-full border outline-none flex-1 text-[28px] font-medium border-none bg-transparent"
                            {...props}
                            ref={ref}
                          />
                          <Button
                            size="lg"
                            variant="secondary"
                            className="font-semibold px-4"
                            onClick={() => field.onChange(max)}
                          >
                            MAX
                          </Button>
                          <span className="text-[28px] font-medium">SSV</span>
                        </div>
                        <Divider />
                        <div className="flex justify-end">
                          <Tooltip
                            asChild
                            content={
                              <Text>
                                Fee increase limits apply.{" "}
                                <Button
                                  as="a"
                                  variant="link"
                                  href="https://docs.ssv.network/learn/operators/update-fee#fee-increase-limits"
                                  target="_blank"
                                >
                                  Learn more
                                </Button>
                              </Text>
                            }
                          >
                            <div className="flex items-center gap-1 text-gray-500">
                              <Text
                                variant="body-2-medium"
                                className="text-gray-500"
                              >
                                Max Fee:{formatBigintInput(max)} SSV{" "}
                              </Text>
                              <FaCircleInfo className="inline-block" />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="xl"
            type="submit"
            isLoading={isLoading}
            disabled={hasErrors || !isChanged}
          >
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

UpdateOperatorFee.displayName = "UpdateOperatorFee";
