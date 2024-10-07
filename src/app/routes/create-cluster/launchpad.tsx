import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks/use-links";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";

export const Launchpad: FC = () => {
  const links = useLinks();
  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Card className="w-full">
        <Text variant="headline4">Visit Ethereum Launchpad</Text>
        <div className="space-y-2">
          <Text variant="body-2-medium">
            You must have an active validator before running it on the SSV
            network.
          </Text>
          <Text variant="body-2-medium">
            Follow Ethereum's launchpad instructions to generate new keys and
            deposit your validator to the deposit contract.
          </Text>
          <Text variant="body-2-medium">
            Please note to backup your newly created validator files, you will
            need them for our setup.
          </Text>
        </div>
        <img
          src="/images/rhino/light.png"
          className="h-[150px] mx-auto my-4"
          alt="rhino"
        />
        <Button as="a" href={links.launchpad} target="_blank" size="xl">
          Visit Ethereum Launchpad
        </Button>
      </Card>
    </Container>
  );
};

Launchpad.displayName = "Launchpad";
