import type { FC, ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Text } from "@/components/ui/text";

export const NoYourOperator: FC<ComponentPropsWithoutRef<"div">> = () => {
  return (
    <div
      data-testid="dashboard-no-your-operator-page"
      className="flex flex-col gap-4 items-center justify-center h-full"
    >
      <div className="flex flex-col gap-1">
        <Text data-testid="dashboard-no-your-operator-title" variant="body-1-bold">
          Not your operator
        </Text>
        <Text
          data-testid="dashboard-no-your-operator-description"
          variant="body-3-medium"
          className="text-gray-500"
        >
          You are not authorized to access this operator.
        </Text>
        <Button
          data-testid="dashboard-no-your-operator-back-btn"
          className="mt-4"
          as={Link}
          to="/operators"
          size="lg"
        >
          Back to Operators Dashboard
        </Button>
      </div>
    </div>
  );
};

NoYourOperator.displayName = "NoYourOperator";
