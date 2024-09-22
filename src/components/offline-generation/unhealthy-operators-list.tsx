import type { ComponentPropsWithRef, FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  OperatorDetails,
  type OperatorDetailsProps,
} from "@/components/operator/operator-details";
import { Badge } from "@/components/ui/badge";
import type { OperatorDKGHealthResponse } from "@/hooks/operator/use-operator-dkg-health";

type Props = {
  operators: OperatorDetailsProps["operator"][];
  health: OperatorDKGHealthResponse[];
};

export const UnhealthyOperatorsList: FC<
  ComponentPropsWithRef<"div"> & Props
> = ({ className, operators, health, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Alert variant="error">
        <AlertDescription>
          DKG method is unavailable because some of your selected operators have
          not provided a DKG endpoint.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-2 ">
        {operators.map((operator) => {
          const isHealthy = health.find((h) => h.id === operator.id)?.isHealthy;
          return (
            <div
              className="flex justify-between items-center p-4 py-3 rounded-xl border border-gray-300"
              key={operator.id}
            >
              <OperatorDetails operator={operator} />
              <Badge size="sm" variant={isHealthy ? "success" : "error"}>
                {isHealthy ? "DKG Enabled" : "DKG Disabled"}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
