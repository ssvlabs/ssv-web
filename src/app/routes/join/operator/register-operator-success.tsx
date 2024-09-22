import type { FC, ComponentPropsWithoutRef } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";

export const RegisterOperatorSuccess: FC<
  ComponentPropsWithoutRef<"div">
> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const operatorId = searchParams.get("operatorId");

  if (!operatorId) {
    navigate("/operators");
    return;
  }

  return (
    <Container className="py-6">
      <Card className="relative overflow-hidden">
        <img
          src="/images/backgroundIcon/light.svg"
          className="absolute top-0 right-0 h-48 pointer-events-none"
          alt=""
        />
        <Text variant="headline4">Welcome to the SSV Network!</Text>
        <Text variant="body-2-medium">
          Congrats, your operator is now part of the SSV network!
          <br /> Your network identifier is:
        </Text>
        <div className="flex items-center gap-1">
          <Text variant="body-1-medium">ID: {operatorId}</Text>
          <CopyBtn className="size-8" text={operatorId} />
          <SsvExplorerBtn className="size-8" operatorId={operatorId} />
        </div>
        <Divider />
        <Text variant="body-2-semibold" className="text-gray-500">
          Next step:
        </Text>
        <div className="p-4 py-8 border border-gray-300 rounded-lg">
          <Button
            variant="link"
            as={Link}
            to="https://docs.ssv.network/operator-user-guides/operator-node/configuring-mev"
            target="_blank"
          >
            Enable MEV
          </Button>{" "}
          to propose MEV blocks for the validators you manage.
        </div>
        <Button as={Link} size="xl" to="/operators">
          Manage operators
        </Button>
      </Card>
    </Container>
  );
};

RegisterOperatorSuccess.displayName = "RegisterOperatorSuccess";
