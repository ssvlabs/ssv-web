import type { FC, ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Text } from "@/components/ui/text";

export const OperatorNotFound: FC<ComponentPropsWithoutRef<"div">> = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex flex-col gap-1">
        <Text variant="body-1-bold">Operator Not Found</Text>
        <Text variant="body-3-medium" className="text-gray-500">
          The operator you are looking for does not exist.
        </Text>
        <Button className="mt-4" as={Link} to="/operators" size="lg">
          Back to Operators Dashboard
        </Button>
      </div>
    </div>
  );
};

OperatorNotFound.displayName = "OperatorNotFound";
