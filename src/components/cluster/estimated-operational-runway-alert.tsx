import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export type EstimatedOperationalRunwayAlertProps = {
  hasDeltaValidators?: boolean;
  isWithdrawing?: boolean;
  isAtRisk: boolean;
  isLiquidated: boolean;
  runway: bigint;
};

type EstimatedOperationalRunwayAlertFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof EstimatedOperationalRunwayAlertProps
  > &
    EstimatedOperationalRunwayAlertProps
>;

export const EstimatedOperationalRunwayAlert: EstimatedOperationalRunwayAlertFC =
  ({
    className,
    isWithdrawing,
    isAtRisk,
    hasDeltaValidators,
    isLiquidated,
    runway,
    ...props
  }) => {
    const isWithdrawingAll = isWithdrawing && runway <= 0n;

    if (!isAtRisk) return null;

    const renderMessage = () => {
      if (hasDeltaValidators) {
        return (
          <Text>
            Your updated operational puts your cluster validators at risk. To
            avoid liquidation please top up your cluster balance with greater
            funds.
          </Text>
        );
      }
      if (isLiquidated) {
        return (
          <Text>
            Your cluster has been liquidated. Please reactivate your cluster in
            order to resume your validators operation.
          </Text>
        );
      }
      if (isWithdrawingAll)
        return (
          <Text>
            Withdrawing the requested amount will liquidate your cluster, which
            will result in inactivation (
            <Button
              variant="link"
              as="a"
              target="_blank"
              href="https://launchpad.ethereum.org/en/faq#responsibilities"
            >
              penalties on the beacon chain
            </Button>
            ) of your validators, as they will no longer be operated by the
            network.
          </Text>
        );

      return (
        <Text>
          {!isWithdrawing
            ? `Your balance is running low and puts your cluster at risk. To avoid liquidation please deposit more funds to your cluster.`
            : `This withdrawal amount will putting your cluster at risk of liquidation. To avoid liquidation please withdraw less funds from your cluster.`}
        </Text>
      );
    };

    return (
      <Alert variant="error" className={cn(className)} {...props}>
        <AlertDescription className="flex flex-col gap-4">
          {renderMessage()}
          <Button
            variant="link"
            as="a"
            target="_blank"
            href="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
          >
            Read more on liquidations
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

EstimatedOperationalRunwayAlert.displayName = "EstimatedOperationalRunwayAlert";
