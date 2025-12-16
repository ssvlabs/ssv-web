import { Button } from "@/components/ui/button";
import { BalanceDisplay } from "@/components/ui/balance-display";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { toast } from "@/components/ui/use-toast";
import { useOperator } from "@/hooks/operator/use-operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useWithdrawOperatorEarnings } from "@/lib/contract-interactions/write/use-withdraw-operator-earnings";
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

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

  const balance = operatorEarnings.data ?? 0n;
  const hasBalance = balance > 0n;

  const withdraw = useWithdrawOperatorEarnings();

  const handleWithdrawAll = () => {
    if (!hasBalance) return;

    return withdraw.write(
      { operatorId: BigInt(operatorId!), amount: balance },
      withTransactionModal({
        onMined: () => {
          toast({
            title: "Withdrawal Successful",
          });
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
        <div className="flex flex-col gap-4">
          <BalanceDisplay amount={1000000000000000n} token="ETH" />
          <BalanceDisplay amount={balance} token="SSV" />
        </div>
        <Button
          disabled={!hasBalance}
          isActionBtn
          isLoading={withdraw.isPending}
          onClick={handleWithdrawAll}
          size="xl"
        >
          Withdraw All
        </Button>
      </Card>
    </Container>
  );
};

WithdrawOperatorBalance.displayName = "WithdrawOperatorBalance";
