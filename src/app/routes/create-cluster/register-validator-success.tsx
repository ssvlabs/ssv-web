import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { shortenAddress } from "@/lib/utils/strings";
import { FaCircleInfo } from "react-icons/fa6";
import { useOperators } from "@/hooks/operator/use-operators";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useSearchParam } from "react-use";
import { createClusterHash } from "@/lib/utils/cluster";

export const RegisterValidatorSuccess: FC = () => {
  const { address } = useAccount();

  const operatorIds =
    useSearchParam("operatorIds")
      ?.split(",")
      .map((id) => Number(id)) ?? [];

  const clusterHash = createClusterHash(address!, operatorIds);
  const operators = useOperators(operatorIds);

  if (!operatorIds.length) return <Navigate to="/clusters" />;

  return (
    <Container variant="vertical" className="py-6">
      <Card>
        <Text variant="headline4">Welcome to the SSV Network!</Text>
        <Text variant="body-2-medium">
          Your new validator is managed by the following cluster:
        </Text>
        <Tooltip
          asChild
          content={
            <>
              Clusters represent a unique set of operators who operate your
              validators. Read more on clusters
            </>
          }
        >
          <div className="flex items-center gap-2 w-fit">
            <Text variant="body-3-bold">
              Validator Cluster {shortenAddress(clusterHash)}
            </Text>
            <FaCircleInfo className="size-3 text-gray-500" />
          </div>
        </Tooltip>

        <div className="flex flex-wrap gap-6">
          {operators.data?.map((operator) => (
            <div className="flex flex-col gap-2" key={operator.id}>
              <OperatorAvatar
                src={operator.logo}
                className="rounded-full size-14"
              />
              <div>
                <Text variant="overline">{operator.name}</Text>
                <Text variant="overline">ID: {operator.id}</Text>
              </div>
            </div>
          ))}
        </div>
        <Text variant="body-2-medium">
          Your cluster operators have been notified and will start your
          validator operation instantly.
        </Text>
        <Button as={Link} to={`/clusters/${clusterHash}`} size="xl">
          Manage Cluster
        </Button>
      </Card>
    </Container>
  );
};

RegisterValidatorSuccess.displayName = "RegisterValidatorSuccess";
