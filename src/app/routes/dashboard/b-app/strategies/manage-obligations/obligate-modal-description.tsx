import { Text } from "@/components/ui/text.tsx";
import { Link } from "react-router-dom";

const ObligateModalDescription = ({
  isObligated,
  isPending,
  isWaiting,
  isExpired,
  endTime,
}: {
  isObligated: boolean;
  isPending: boolean;
  isWaiting: boolean;
  isExpired: boolean;
  endTime: string;
}) => {
  const getDescription = () => {
    const descriptions = {
      ["request"]: (
        <div className="w-full h-full flex flex-col gap-2">
          <Text variant={"body-3-medium"}>
            Changing an obligation takes effect in multiple steps:
          </Text>
          <Text variant={"body-3-medium"}>
            The process starts by requesting a new obligation percentage, which
            is followed by pending period. Once the pending period has elapsed,
            you can finalize the new obligation by executing it. Percentage
            change limits apply.&nbsp;
            <Link
              target={"_blank"}
              className="text-primary-500 underline"
              to={
                "https://docs.ssv.network/based-applications/user-guides/strategy-features/manage-obligations/change-obligation/"
              }
            >
              Learn more
            </Link>
          </Text>
        </div>
      ),
      ["pending"]: (
        <div className="w-full h-full flex flex-col gap-2">
          <Text variant={"body-3-medium"}>
            You have requested an obligation change. This change will become
            executable in {endTime}. Once the pending period ends, you will be
            able to finalize it.
          </Text>
        </div>
      ),
      ["waiting"]: (
        <div className="w-full h-full flex flex-col gap-2">
          <Text variant={"body-3-medium"}>
            Execute your obligation change in order to finalize the process. The
            new obligation will take effect immediately.
          </Text>
          <Text variant={"body-3-medium"}>
            Keep in mind that if you do not execute this change within {endTime}
            , your request will expire and you will have to start the process
            anew.
          </Text>
        </div>
      ),
      ["expired"]: (
        <div className="w-full h-full flex flex-col gap-2">
          <Text variant={"body-3-medium"}>
            Your requested obligation change has expired because you did not
            execute the change. You need to initiate a new request to update
            this obligation.
          </Text>
        </div>
      ),
    };

    const currentStatus =
      !isExpired && !isPending && !isWaiting
        ? "request"
        : isPending
          ? "pending"
          : isWaiting
            ? "waiting"
            : "expired";

    return descriptions[currentStatus];
  };

  return isObligated ? (
    getDescription()
  ) : (
    <div className="w-full h-full flex flex-col gap-2">
      <Text variant={"body-3-medium"}>
        Adding an obligation for this asset will take immediate effect.&nbsp;
        <Link
          target={"_blank"}
          className="text-primary-500 underline"
          to={
            "https://docs.ssv.network/based-applications/user-guides/strategy-features/manage-obligations/add-obligation/"
          }
        >
          Learn more
        </Link>
      </Text>
    </div>
  );
};

export default ObligateModalDescription;
