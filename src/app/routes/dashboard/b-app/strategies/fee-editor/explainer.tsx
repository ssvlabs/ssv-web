import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { RequestStatus } from "@/hooks/b-app/strategy/use-strategy-fee-change-request";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";
import { ms } from "@/lib/utils/number";
import { generateGoogleCalendarUrl } from "@/lib/utils/google";

export type ExplainerProps = {
  status: RequestStatus;
  expireTimestamp: number;
};

type ExplainerFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ExplainerProps> & ExplainerProps
>;

export const Explainer: ExplainerFC = ({
  className,
  status,
  expireTimestamp,
  ...props
}) => {
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
          execute your new fee by{" "}
          <Tooltip content="Add to calendar">
            <Button
              as="a"
              variant="link"
              className="p-0 h-auto font-medium underline"
              href={generateGoogleCalendarUrl({
                title: `Fee Change Deadline`,
                dates: {
                  start: expireTimestamp - ms(1, "hours"),
                  end: expireTimestamp,
                },
                description: `Execute your strategy fee change before this date or the request will expire.`,
                isAllDay: false,
              })}
              target="_blank"
            >
              <b>{format(expireTimestamp, "MMM d")}</b>
            </Button>
          </Tooltip>
          , your request will expire and you will have to start the process
          anew.
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
