import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { RequestStatus } from "@/hooks/b-app/strategy/use-strategy-fee-change-request";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export type ExplainerProps = {
  status: RequestStatus;
};

type ExplainerFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ExplainerProps> & ExplainerProps
>;

export const Explainer: ExplainerFC = ({ className, status, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      {status === "none" && (
        <div className="flex flex-col gap-1.5">
          <Text variant="body-3-medium" className="text-gray-700">
            Reducing your strategy fee is immediate, increasing is done in a few
            steps:
          </Text>
          <Text variant="body-3-medium" className="text-gray-700">
            The process starts by declaring a new fee, which is followed by
            pending period. Once the pending period has elapsed, you can
            finalize your new fee by executing it. Fee increase limits apply.{" "}
            <Button as="a" variant="link" href="#" target="_blank">
              Learn more
            </Button>
          </Text>
        </div>
      )}
      {status === "pending" && (
        <Text variant="body-3-medium" className="text-gray-700">
          You have requested a fee change. Keep in mind that if you do not
          execute your new fee by 25 May, your request will expire and you will
          have to start the process anew.
        </Text>
      )}
      {status === "executable" && (
        <Text variant="body-3-medium" className="text-gray-700">
          Execute your new fee in order to finalize the fee update process. Your
          new fee will take effect immediately.
        </Text>
      )}
      {status === "expired" && (
        <Text variant="body-3-medium" className="text-gray-700">
          Your requested fee change has expired because you did not execute the
          change. You need to request a new fee change to update your strategy
          fee.
        </Text>
      )}
    </div>
  );
};

Explainer.displayName = "Explainer";
