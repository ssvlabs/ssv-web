import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { shortenAddress } from "@/lib/utils/strings";
import { FaCircleInfo } from "react-icons/fa6";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Operator } from "@/types/api";

type SwitchWizardStepFourProps = {
  clusterHash?: string;
  operators?: Pick<Operator, "id" | "name" | "logo">[];
  clusterPath?: string;
};

export const SwitchWizardStepFour: FC<SwitchWizardStepFourProps> = ({
  clusterHash,
  operators = [],
  clusterPath,
}) => {
  return (
    <Container variant="vertical" className="py-6">
      <Card
        variant="unstyled"
        className="w-full flex flex-col gap-6 p-8 bg-white rounded-2xl"
      >
        <div className="flex flex-col gap-4 items-start">
          <Text variant="headline4">
            Cluster Successfully Migrated to ETH Fees
          </Text>
          <Text variant="body-2-medium" className="text-gray-700">
            Your new validator are now managed by the following cluster:
          </Text>
        </div>

        <Tooltip
          asChild
          content={
            <>
              Clusters represent a unique set of operators who operate your
              validators.
            </>
          }
        >
          <div className="flex items-center gap-2 w-fit">
            <Text variant="body-3-medium" className="text-gray-500">
              Validator Cluster |{" "}
              {clusterHash ? shortenAddress(clusterHash) : "..."}
            </Text>
            <FaCircleInfo className="size-4 text-gray-500" />
          </div>
        </Tooltip>

        <div className="flex gap-2 items-center flex-wrap">
          {operators.map((operator) => (
            <div
              className="flex flex-col gap-2 items-center w-[60px]"
              key={operator.id}
            >
              <div className="flex items-center justify-center size-[60px] rounded-full border border-gray-300 p-2">
                <OperatorAvatar
                  src={operator.logo}
                  size="lg"
                  variant="circle"
                />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Text variant="overline" className="text-gray-800 text-center">
                  {operator.name}
                </Text>
                <Text variant="overline" className="text-gray-500 text-center">
                  ID: {operator.id}
                </Text>
              </div>
            </div>
          ))}
        </div>

        <Text variant="body-2-medium" className="text-gray-700">
          Your validators remain fully managed by the same operator cluster:
        </Text>

        {clusterPath ? (
          <Button
            as={Link}
            to={clusterPath}
            size="xl"
            width="full"
            className="font-semibold"
          >
            Manage Cluster
          </Button>
        ) : (
          <Button size="xl" width="full" className="font-semibold" disabled>
            Manage Cluster
          </Button>
        )}
      </Card>
    </Container>
  );
};
