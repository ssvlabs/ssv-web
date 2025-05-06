import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import type { FC } from "react";
import { Link } from "react-router-dom";

export const NotFound: FC = () => {
  return (
    <Container
      variant="vertical"
      className="max-w-screen-2xl w-full p-6 items-center h-full"
    >
      <div className="flex flex-1 justify-center items-center flex-col">
        <img src="/images/404Robot.svg" alt="not found" className="w-40" />
        <Text variant="headline2" className="text-gray-700 mt-16">
          Page not found
        </Text>
        <div className="flex items-center flex-col gap-8 text-center mt-7">
          <Text variant="body-2-semibold">
            The page you are looking for does not exist.
          </Text>
          <Button
            as={Link}
            variant="secondary"
            size="xl"
            className="w-fit"
            to="/"
          >
            Go to My Account
          </Button>
        </div>
      </div>
    </Container>
  );
};

NotFound.displayName = "NotFound";
