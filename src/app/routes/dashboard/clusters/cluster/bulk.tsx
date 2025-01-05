import { type FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { TableCell, TableRow } from "@/components/ui/grid-table";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Badge } from "@/components/ui/badge";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Button } from "@/components/ui/button";
import { LuSatelliteDish } from "react-icons/lu";
import { xor } from "lodash-es";
import { useLinks } from "@/hooks/use-links";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import { Link } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { ValidatorStatusBadge } from "@/components/cluster/validator-status-badge.tsx";
import { useParams } from "react-router";
import type { Validator } from "@/types/api.ts";

export const Bulk: FC<{ type: "remove" | "exit" }> = ({ type }) => {
  const links = useLinks();
  const { clusterHash } = useClusterPageParams();
  const { _selectedPublicKeys: selectedPublicKeys } = useBulkActionContext();
  const params = useParams();
  const externalValidators = params.publicKeys
    ? params.publicKeys.split(",")
    : undefined;
  const { infiniteQuery, validators, total } = useInfiniteClusterValidators(
    clusterHash,
    100,
  );
  const validatorsToUse = externalValidators
    ? validators.filter((validator: Validator) =>
        externalValidators?.includes(
          validator.public_key.startsWith("0x")
            ? validator.public_key
            : `0x${validator.public_key}`,
        ),
      )
    : validators;
  const totalValidators = externalValidators
    ? externalValidators.length
    : total;
  const isAllChecked =
    Boolean(totalValidators) && selectedPublicKeys.length === totalValidators;
  const canProceed = selectedPublicKeys.length > 0;

  // TODO: fetch validators to get status
  return (
    <Container variant="vertical" size="lg" className="py-6 h-full">
      <NavigateBackBtn to={`/clusters/${clusterHash}`} />
      <Card className="w-full flex-1">
        <div className="flex justify-between">
          <Text variant="headline4">
            {type === "remove"
              ? "Select validators to Remove"
              : "Select validators to Exit"}
          </Text>
          <Badge variant="primary">
            {selectedPublicKeys.length} of {totalValidators} selected
          </Badge>
        </div>
        <VirtualizedInfinityTable
          gridTemplateColumns="40px 220px minmax(200px, auto) 120px"
          query={infiniteQuery}
          className={cn("min-h-96 flex-1")}
          headers={[
            <div className="size-5">
              <Checkbox
                checked={isAllChecked}
                onClick={() => {
                  if (!isAllChecked) {
                    useBulkActionContext.state._selectedPublicKeys =
                      validatorsToUse.map((v) => v.public_key);
                  } else {
                    useBulkActionContext.state._selectedPublicKeys = [];
                  }
                }}
              />
            </div>,
            <Text>Public key</Text>,
            <Tooltip
              asChild
              content="Refers to the validators status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs)"
            >
              <div className="flex w-fit gap-2 items-center">
                <Text>Status</Text>
                <FaCircleInfo className="size-3 text-gray-500" />
              </div>
            </Tooltip>,
            null,
          ]}
          items={validatorsToUse}
          renderRow={({ index, item }) => (
            <TableRow
              as="label"
              className="select-none cursor-pointer"
              htmlFor={item.public_key}
              key={index}
              clickable
            >
              <TableCell className="flex gap-2 items-center">
                <Checkbox
                  id={item.public_key}
                  checked={selectedPublicKeys.includes(item.public_key)}
                  onCheckedChange={() =>
                    (useBulkActionContext.state._selectedPublicKeys = xor(
                      useBulkActionContext.state._selectedPublicKeys,
                      [item.public_key],
                    ))
                  }
                />
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <Text variant="body-2-medium">
                  {shortenAddress(add0x(item.public_key))}
                </Text>
                <CopyBtn variant="subtle" text={item.public_key} />
              </TableCell>
              <TableCell>
                <ValidatorStatusBadge size="sm" status={item.status} />
              </TableCell>
              <TableCell className="flex gap-1 justify-end">
                <SsvExplorerBtn validatorId={item.public_key} />
                <Button
                  as="a"
                  size="icon"
                  className="size-7 text-gray-700"
                  variant="subtle"
                  href={`${links.beaconcha}/validator/${item.public_key}`}
                  target="_blank"
                >
                  <LuSatelliteDish className="size-[65%]" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        />
        <Button
          as={Link}
          to={`/clusters/${clusterHash}/remove/confirmation`}
          size="xl"
          disabled={!canProceed}
        >
          Next
        </Button>
      </Card>
    </Container>
  );
};

Bulk.displayName = "Bulk";
