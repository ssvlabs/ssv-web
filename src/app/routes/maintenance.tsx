import type { FC } from "react";
import { SsvLogo } from "@/components/ui/ssv-logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks/use-links";
import { Navigate } from "react-router";
import { useMaintenance } from "@/hooks/app/use-maintenance";

export const Maintenance: FC = () => {
  const links = useLinks();
  const { isMaintenancePage } = useMaintenance();

  if (!isMaintenancePage) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container
      variant="vertical"
      className="max-w-screen-2xl w-full p-6 items-center h-full"
    >
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full justify-between items-center">
          <SsvLogo className="h-full" />
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center flex-col">
        <img src="/images/maintenance.svg" alt="Maintenance" className="w-40" />
        <Text variant="headline2" className="text-gray-700 mt-16">
          The site is currently down for maintenance
        </Text>
        <div className="flex flex-col gap-2 text-center mt-7">
          <Text variant="body-1-medium">
            We'll be back up and running again shortly
          </Text>
          <Text variant="body-3-medium" className="text-gray-600">
            You can reach us on{" "}
            <Button
              variant="link"
              as="a"
              href={links.ssv.discord}
              target="_blank"
            >
              Discord
            </Button>
          </Text>
        </div>
      </div>
    </Container>
  );
};

Maintenance.displayName = "Maintenance";
