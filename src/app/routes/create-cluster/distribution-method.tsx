import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useMatchHistory } from "@/hooks/use-match-history";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";

type Props = {
  variant?: "create" | "add";
};

export const DistributionMethod: FC<Props> = ({ variant = "create" }) => {
  const { clusterHash } = useClusterPageParams();

  const operatorsRoute = useMatchHistory("/join/validator/select-operators");

  const prevPath = clusterHash
    ? `/clusters/${clusterHash}`
    : operatorsRoute
      ? operatorsRoute.pathname + operatorsRoute.search
      : "/join/validator/select-operators";

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn to={prevPath} />
      <Card className="font-medium">
        <Text variant="headline4">Generate Validator KeyShares</Text>
        <Text>
          To run a Distributed Validator you must split your validation key into{" "}
          <b>Key Shares</b> and distribute them across your selected operators
          to operate in your behalf
        </Text>
        <img src="/images/generateValidatorKeyShare/image.svg" />
        <Text>Select your preferred method to split your key:</Text>
        <div className="space-y-3">
          <div className="flex [&>*]:flex-1 gap-3">
            <div className="flex flex-col gap-2">
              <Button as={Link} to="../online" variant="secondary" size="xl">
                Online
              </Button>
              {variant === "create" && (
                <Text
                  variant="body-3-medium"
                  className="text-center text-gray-500"
                >
                  Split key via the webapp
                </Text>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button as={Link} to="../offline" variant="secondary" size="xl">
                Offline
              </Button>
              {variant === "create" && (
                <Text
                  variant="body-3-medium"
                  className="text-center text-gray-500"
                >
                  Split key on your computer
                </Text>
              )}
            </div>
          </div>
          {variant === "add" && (
            <Button
              as={Link}
              to="../keyshares"
              variant="secondary"
              size="xl"
              className="w-full"
            >
              I already have key shares
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
};

DistributionMethod.displayName = "DistributionMethod";
