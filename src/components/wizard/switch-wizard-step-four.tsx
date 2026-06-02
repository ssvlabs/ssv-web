import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { shortenClusterId } from "@/lib/utils/strings";
import { FaCircleInfo } from "react-icons/fa6";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Operator } from "@/types/api";

type SwitchWizardStepFourProps = {
  clusterHash?: string;
  operators?: Operator[];
  clusterPath?: string;
};

export const SwitchWizardStepFour: FC<SwitchWizardStepFourProps> = ({
  clusterHash,
  operators = [],
  clusterPath,
}) => {
  return (
    <Container
      data-testid="switch-wizard-step-four-page"
      variant="vertical"
      className="py-6"
    >
      <Card
        variant="unstyled"
        className="relative w-full overflow-hidden rounded-2xl bg-white p-8"
      >
        <img
          src="/images/backgroundIcon/light.svg"
          className="pointer-events-none absolute right-0 top-0 h-48"
          alt=""
        />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 items-start">
            <Text
              data-testid="switch-wizard-step-four-title"
              variant="headline4"
            >
              Cluster Successfully Migrated to ETH Fees
            </Text>
            <Text variant="body-2-medium" className="text-gray-700">
              Your existing validators will continue to be managed by the
              operator cluster:
            </Text>
          </div>

          <div className="flex flex-col gap-4 items-start">
            <Tooltip
              asChild
              content={
                <>
                  Clusters represent a unique set of operators who operate your
                  validators.
                </>
              }
            >
              <div className="flex items-center gap-1 w-fit">
                <Text variant="body-3-semibold" className="text-gray-500">
                  Validator Cluster |{" "}
                  {clusterHash ? shortenClusterId(clusterHash) : "..."}
                </Text>
                <FaCircleInfo className="size-3.5 text-gray-500" />
              </div>
            </Tooltip>

            <div className="flex items-start gap-3 flex-wrap pr-10">
              {operators.map((operator) => (
                <div
                  className="flex flex-col gap-2 items-center w-[60px]"
                  key={operator.id}
                >
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-gray-300">
                    <OperatorAvatar
                      src={operator.logo}
                      size="lg"
                      variant="square"
                    />
                  </div>
                  <div className="flex w-full flex-col items-center">
                    <Text
                      variant="caption-medium"
                      className="w-full truncate text-center text-gray-900"
                    >
                      {operator.name}
                    </Text>
                    <Text
                      as="span"
                      className="w-full text-center text-[9px] font-medium leading-4 text-gray-500"
                    >
                      ID: {operator.id}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Text variant="body-2-medium" className="text-gray-700">
            Your operators will now charge fees in ETH, and your runway will be
            calculated based on your ETH balance. Your remaining SSV balance has
            been withdrawn to your wallet
          </Text>

          {clusterPath ? (
            <Button
              data-testid="switch-wizard-step-four-manage-cluster-btn"
              as={Link}
              to={clusterPath}
              size="xl"
              width="full"
              className="font-semibold"
            >
              Manage Cluster
            </Button>
          ) : (
            <Button
              data-testid="switch-wizard-step-four-manage-cluster-btn-disabled"
              size="xl"
              width="full"
              className="font-semibold"
              disabled
            >
              Manage Cluster
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
};
