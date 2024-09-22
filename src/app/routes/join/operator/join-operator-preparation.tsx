import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link } from "react-router-dom";

export const JoinOperatorPreparation: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn to="/operators"></NavigateBackBtn>
      <Card className={cn(className)} {...props}>
        <Text variant="headline4">Join the SSV Network Operators</Text>
        <Text>
          To join as an network operator, you must run an SSV node. Start with
          your node setup and return here to register your operator key.
        </Text>
        <div className="flex gap-4">
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              as="a"
              target="_blank"
              href="https://docs.ssv.network/operator-user-guides/operator-node/installation"
            >
              Run SSV Node
            </Button>
            <Text variant="body-3-medium" className="text-gray-500">
              Follow our installation docs
            </Text>
          </div>
          <div className="flex-1 flex gap-2 flex-col items-center">
            <Button
              as={Link}
              to="register"
              variant="secondary"
              size="xl"
              className="w-full"
            >
              Register Operator
            </Button>
            <Text variant="body-3-medium" className="text-gray-500">
              Sign up with your operator key
            </Text>
          </div>
        </div>
      </Card>
    </Container>
  );
};

JoinOperatorPreparation.displayName = "CreateOperatorPreparation";
