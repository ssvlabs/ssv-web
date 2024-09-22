import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { NumberInput } from "@/components/ui/number-input";
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
          <NumberInput
            disabled={withdraw.isPending || !hasBalance}
            className="text-xl h-16 font-bold"
            value={form.watch("value")}
            onChange={(value) =>
              form.setValue("value", value, { shouldValidate: true })
            }
            max={max}
            rightSlot={
              <div className="flex items-center gap-3 px-3">
                <Button
                  disabled={!hasBalance}
                  size="sm"
                  className="px-4"
                  variant="secondary"
                  onClick={() =>
                    form.setValue("value", max, { shouldValidate: true })
                  }
                >
                  Max
                </Button>
                <Text>SSV</Text>
              </div>
            }
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
