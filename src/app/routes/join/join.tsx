import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Link } from "react-router-dom";

export const Join: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <Container variant="vertical" className="py-6">
      <Card className={cn(className)} {...props}>
        <div className="space-y-3">
          <Text variant="headline4">Join the SSV Network</Text>
          <Text>
            Distribute your validator to run on the SSV network or help maintain
            it as one of its operators.
          </Text>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button
              as={Link}
              to="validator"
              size="xl"
              variant="secondary"
              className="w-full"
            >
              Distribute Validators
            </Button>
          </div>
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button
              as={Link}
              to="operator"
              variant="secondary"
              size="xl"
              className="w-full"
            >
              Join as Operator
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};

Join.displayName = "Join";
