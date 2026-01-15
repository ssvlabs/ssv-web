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
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import {
  useWithdrawAllOperatorEarnings,
  useWithdrawAllOperatorEarningsSSV,
  useWithdrawAllVersionOperatorEarnings,
} from "@/lib/contract-interactions/hooks/setter";
import { useGetOperatorEarningsSSV } from "@/lib/contract-interactions/hooks/getter";

export const WithdrawOperatorBalance: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const { operatorId } = useOperatorPageParams();

  const { data: operator } = useOperator();
  const operatorEarningsEth = useGetOperatorEarnings({
    id: BigInt(operatorId!),
  });
  const operatorEarningsSSV = useGetOperatorEarningsSSV({
    id: BigInt(operatorId!),
  });

  const balanceEth = operatorEarningsEth.data ?? 0n;
  const balanceSSV = operatorEarningsSSV.data ?? 0n;
  const hasSSVBalance = balanceSSV > 0n;
  const hasETHBalance = balanceEth > 0n;
  const hasBalance = hasSSVBalance || hasETHBalance;
  const hasBothBalances = hasSSVBalance && hasETHBalance;

  const withdrawAll = useWithdrawAllVersionOperatorEarnings();
  const withdrawAllSSV = useWithdrawAllOperatorEarningsSSV();
  const withdrawAllETH = useWithdrawAllOperatorEarnings();

  const withdraw = hasBothBalances
    ? withdrawAll
    : hasETHBalance
      ? withdrawAllETH
      : withdrawAllSSV;

  const handleWithdrawAll = () => {
    if (!hasBalance) return;

    return withdraw.write({
      args: { operatorId: BigInt(operatorId!) },
      options: withTransactionModal({
        onMined: () => {
          toast({
            title: "Withdrawal Successful",
          });
          operatorEarningsEth.refetch();
          operatorEarningsSSV.refetch();
          return () => navigate("..");
        },
      }),
    });
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
          {hasETHBalance && <BalanceDisplay amount={balanceEth} token="ETH" />}
          {hasSSVBalance && <BalanceDisplay amount={balanceSSV} token="SSV" />}
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
