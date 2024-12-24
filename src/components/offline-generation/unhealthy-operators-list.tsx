import type { ComponentPropsWithRef, FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  OperatorDetails,
  type OperatorDetailsProps,
} from "@/components/operator/operator-details";
import type { BadgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import type { OperatorDKGHealthResponse } from "@/hooks/operator/use-operator-dkg-health";

type Props = {
  operators: OperatorDetailsProps["operator"][];
  health: OperatorDKGHealthResponse[];
  isReshareMultiSigFlow?: boolean;
};

const getBadgeInfo = (
  healthData: OperatorDKGHealthResponse,
  isReshareFlow?: boolean,
): { variant: BadgeVariants["variant"]; text: string } => {
  if (healthData.isMismatchId) {
    return {
      variant: "error" as BadgeVariants["variant"],
      text: "ID/IP Mismatch",
    };
  }
  if (isReshareFlow) {
    if (healthData.isOutdated) {
      return {
        variant: "warning" as BadgeVariants["variant"],
        text: "Dkg Outdated",
      };
    }
    if (!healthData.isEthClientConnected) {
      return {
        variant: "error" as BadgeVariants["variant"],
        text: "ETH1 Node Offline",
      };
    }
    if (healthData.isHealthy) {
      return {
        variant: "success" as BadgeVariants["variant"],
        text: "DKG Enabled",
      };
    }
    return {
      variant: "error" as BadgeVariants["variant"],
      text: "DKG Disabled",
    };
  }

  return healthData.isHealthy
    ? { variant: "success", text: "DKG Enabled" }
    : { variant: "error", text: "DKG Disabled" };
};

export const UnhealthyOperatorsList: FC<
  ComponentPropsWithRef<"div"> & Props
> = ({ className, operators, health, isReshareMultiSigFlow, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Alert variant="error">
        <AlertDescription>
          {isReshareMultiSigFlow
            ? "DKG method is unavailable because some of your selected operators do not have an active execution client connected."
            : "DKG method is unavailable because some of your selected operators have not provided a DKG endpoint."}
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-2 ">
        {operators.map((operator) => {
          const healthData = health.find(
            (h) => h.id === operator.id.toString(),
          );

          const { variant: badgeVariant, text: badgeText } = getBadgeInfo(
            healthData || ({} as OperatorDKGHealthResponse),
            isReshareMultiSigFlow,
          );

          return (
            <div
              className="flex justify-between items-center p-4 py-3 rounded-xl border border-gray-300"
              key={operator.id}
            >
              <OperatorDetails operator={operator} />
              <Badge size="sm" variant={badgeVariant}>
                {badgeText}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
