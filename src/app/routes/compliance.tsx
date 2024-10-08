import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { useCompliance } from "@/hooks/app/use-compliance";
import { useLinks } from "@/hooks/use-links";
import type { FC } from "react";
import { Navigate } from "react-router";

export const Compliance: FC = () => {
  const links = useLinks();
  const compliance = useCompliance();

  if (!compliance.data) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container
      variant="vertical"
      className="max-w-screen-2xl w-full p-6 items-center h-full"
    >
      <div className="flex flex-1 justify-center items-center flex-col">
        <img src="/images/robot.svg" alt="Maintenance" className="w-40" />
        <Text variant="headline2" className="text-gray-700 mt-16">
          Website not available
        </Text>
        <div className="flex flex-col gap-2 text-center mt-7">
          <Text variant="body-2-semibold">
            We noticed you are located in {compliance.data}
          </Text>
          <Text variant="body-2-medium">
            Please note that the website{" "}
            <span className="text-primary-500">{window.location.host}</span> is
            not available in your country
          </Text>
          <Button
            className="mt-2"
            variant="link"
            as="a"
            href={links.ssv.website}
            target="_blank"
          >
            Learn more about the SSV Network
          </Button>
        </div>
      </div>
    </Container>
  );
};

Compliance.displayName = "Compliance";
