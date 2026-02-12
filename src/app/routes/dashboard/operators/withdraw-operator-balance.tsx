import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { BigNumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { toast } from "@/components/ui/use-toast";
import { useOperator } from "@/hooks/operator/use-operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useWithdrawOperatorEarnings } from "@/lib/contract-interactions/write/use-withdraw-operator-earnings";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Collapse } from "react-collapse";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

export const WithdrawOperatorBalance: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const { operatorId } = useOperatorPageParams();

  const { data: operator } = useOperator();
  const operatorEarnings = useGetOperatorEarnings({
    id: BigInt(operatorId!),
  });

  const max = operatorEarnings.data ?? 0n;

  const hasBalance = max > 0n;

  const schema = z.object({
    value: z
      .bigint()
      .max(max, "Value exceeds available balance")
      .positive("Value must be greater than 0"),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { value: 0n },
    resolver: zodResolver(schema),
  });

  const withdraw = useWithdrawOperatorEarnings();

  const submit = ({ value }: z.infer<typeof schema>) => {
    return withdraw.write(
      { operatorId: BigInt(operatorId!), amount: value },
      withTransactionModal({
        onMined: () => {
          toast({
            title: "Withdrawal Successful",
          });
          form.reset();
          operatorEarnings.refetch();
          return () => navigate("..");
        },
      }),
    );
  };

  return (
    <Container variant="vertical" className={cn(className, "py-6")} {...props}>
      <Helmet>
        <title>Withdraw {operator?.name ?? ""}</title>
      </Helmet>
      <NavigateBackBtn>{operator?.name}</NavigateBackBtn>
      <Card className="w-full">
        <Text variant="headline4" className="text-gray-500">
          Available Balance
        </Text>
        <Text variant="headline1">{formatSSV(max)} SSV</Text>
      </Card>
      <Card as="form" onSubmit={form.handleSubmit(submit)} className="w-full">
        <Text variant="headline4" className="text-gray-500">
          Withdraw
        </Text>
        <div className="flex flex-col">
          <BigNumberInput
            disabled={withdraw.isPending || !hasBalance}
            value={form.watch("value")}
            onChange={(value) =>
              form.setValue("value", value, { shouldValidate: true })
            }
            max={max}
            render={(props, ref) => (
              <div className="flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-gray-300 bg-gray-200">
                <div className="flex h-14 items-center gap-5">
                  <input
                    disabled={withdraw.isPending || !hasBalance}
                    placeholder="0"
                    className="w-full h-full border outline-none flex-1 text-[28px] font-medium border-none bg-transparent"
                    {...props}
                    ref={ref}
                  />
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-semibold px-4"
                    onClick={() =>
                      form.setValue("value", max, { shouldValidate: true })
                    }
                  >
                    MAX
                  </Button>
                  <span className="text-[28px] font-medium">SSV</span>
                </div>
              </div>
            )}
          />
          <Collapse isOpened={Boolean(form.formState.errors.value)}>
            <Text variant="body-2-medium" className="text-error-500">
              {form.formState.errors.value?.message}
            </Text>
          </Collapse>
        </div>
        <Button
          disabled={Boolean(form.formState.errors.value) || !hasBalance}
          isActionBtn
          isLoading={withdraw.isPending}
          type="submit"
          size="xl"
        >
          Withdraw
        </Button>
      </Card>
    </Container>
  );
};

WithdrawOperatorBalance.displayName = "WithdrawOperatorBalance";
