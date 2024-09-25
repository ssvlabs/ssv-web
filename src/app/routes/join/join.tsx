import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useAccountState } from "@/hooks/account/use-account-state";
import { cn } from "@/lib/utils/tw";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { Link, Navigate } from "react-router-dom";

export const Join: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { isLoading, isNewAccount, accountRoutePath } = useAccountState();
  if (!isLoading && !isNewAccount)
    return <Navigate to={accountRoutePath ?? "/clusters"} replace />;

  return (
    <Container variant="vertical" className="py-6">
      <Card className={cn(className)} {...props}>
        <CardHeader
          title="Join the SSV Network"
          description="Distribute your validator to run on the SSV network or help maintain it as one of its operators."
        />
        <div className="flex gap-3">
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
