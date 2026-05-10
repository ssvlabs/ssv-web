import type { ComponentPropsWithRef, FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  OperatorDetails,
  type OperatorDetailsProps,
} from "@/components/operator/operator-details";
import type { BadgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import type { EnrichedOperatorDKGHealthResponse } from "@/hooks/operator/use-operator-dkg-health";

const withVersion = (text: string, version?: string) =>
  version ? `${text} (${version})` : text;

export const getBadgeInfo = (
  healthData: EnrichedOperatorDKGHealthResponse,
  isMultiSigFlow: boolean | undefined,
  showVersion: boolean,
): { variant: BadgeVariants["variant"]; text: string } => {
  const versionSuffix = showVersion
    ? `${healthData.version || `N/A`}`
    : undefined;

  if (healthData.isMismatchId) {
    return {
      variant: "error" as BadgeVariants["variant"],
      text: "ID/IP Mismatch",
    };
  }
  if (healthData.isOutdated || healthData.isMismatchVersion) {
    return {
      variant: "warning" as BadgeVariants["variant"],
      text: withVersion("DKG Outdated", versionSuffix),
    };
  }
  if (isMultiSigFlow) {
    if (!healthData.isEthClientConnected) {
      return {
        variant: "error" as BadgeVariants["variant"],
        text: "ETH1 Node Offline",
      };
    }
    if (healthData.isHealthy) {
      return {
        variant: "success" as BadgeVariants["variant"],
        text: withVersion("DKG Enabled", versionSuffix),
      };
    }
    return {
      variant: "error" as BadgeVariants["variant"],
      text: "DKG Disabled",
    };
  }

  return healthData.isHealthy
    ? { variant: "success", text: withVersion("DKG Enabled", versionSuffix) }
    : { variant: "error", text: "DKG Disabled" };
};
type Props = {
  operators: OperatorDetailsProps["operator"][];
  health: EnrichedOperatorDKGHealthResponse[];
  hasVersionMismatch?: boolean;
  isMultiSigFlow?: boolean;
};

export const UnhealthyOperatorsList: FC<
  ComponentPropsWithRef<"div"> & Props
> = ({
  className,
  operators,
  health,
  hasVersionMismatch = false,
  isMultiSigFlow,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Alert variant="error">
        <AlertDescription>
          DKG method is unavailable because one or more selected operators have
          an issue that prevents DKG operations.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-2 ">
        {operators.map((operator) => {
          const healthData = health.find(
            (h) => h.id === operator.id.toString(),
          );

          const { variant: badgeVariant, text: badgeText } = getBadgeInfo(
            healthData || ({} as EnrichedOperatorDKGHealthResponse),
            isMultiSigFlow,
            hasVersionMismatch,
          );

          return (
            <div
              className="flex justify-between items-center p-4 py-3 rounded-xl border border-gray-300"
              key={operator.id}
            >
              <OperatorDetails isShowExplorerLink={false} operator={operator} />
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
