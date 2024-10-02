import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useAccountState } from "@/hooks/account/use-account-state";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { BiCheck } from "react-icons/bi";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router-dom";

export type PreparationProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof PreparationProps> &
    PreparationProps
>;

export const Preparation: FCProps = ({ className, ...props }) => {
  const { isNewAccount, accountRoutePath } = useAccountState();
  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn to={(isNewAccount && accountRoutePath) || "/clusters"} />
      <Card className={cn(className)} {...props}>
        <CardHeader
          title="Run a Distributed Validator"
          description="Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity."
        />
        <Text variant="body-2-semibold" className="text-gray-500">
          Prerequisites
        </Text>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BiCheck className="size-5 text-green-500" />
            <Text variant="body-2-medium">
              An active Ethereum validator (deposited to Beacon Chain)
            </Text>
            <Tooltip
              content={
                <Text>
                  Don't have a validator?{" "}
                  <Button
                    as={Link}
                    className="link"
                    variant="link"
                    to="/join/launchpad"
                  >
                    Create via Ethereum Launchpad
                  </Button>
                </Text>
              }
            >
              <FaCircleInfo className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <BiCheck className="size-5 text-green-500" />
            <Text variant="body-2-medium">
              SSV tokens to cover operational fees
            </Text>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3">
          <Button
            as={Link}
            to="select-operators"
            onClick={() => {
              useRegisterValidatorContext.resetState({
                flow: "generate-new-keyshares",
              });
            }}
            size="xl"
          >
            Generate new key shares
          </Button>
          <Button
            as={Link}
            to="keyshares"
            size="xl"
            variant="secondary"
            onClick={() => {
              useRegisterValidatorContext.resetState({
                flow: "generate-from-existing-keyshares",
              });
            }}
          >
            I already have key shares
          </Button>
        </div>
      </Card>
    </Container>
  );
};

Preparation.displayName = "Preparation";
