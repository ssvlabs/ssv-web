import type { FC, ComponentPropsWithoutRef } from "react";
import { CopyBtn } from "@/components/ui/copy-btn";
import { TableRow, TableCell } from "@/components/ui/grid-table";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { shortenAddress } from "@/lib/utils/strings";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { LuSatelliteDish } from "react-icons/lu";
import { useLinks } from "@/hooks/use-links";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { useInfiniteOperatorValidators } from "@/hooks/operator/use-infinite-operator-validators";
import { ValidatorStatusBadge } from "@/components/cluster/validator-status-badge";

export const OperatorValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const { validators, infiniteQuery } = useInfiniteOperatorValidators();
  const links = useLinks();
  return (
    <VirtualizedInfinityTable
      gridTemplateColumns="220px minmax(200px, auto) 120px"
      {...props}
      query={infiniteQuery}
      headers={[
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
      items={validators}
      renderRow={({ index, item }) => (
        <TableRow key={index}>
          <TableCell className="flex gap-2 items-center">
            <Text variant="body-2-medium">
              {shortenAddress(item.public_key)}
            </Text>
            <CopyBtn variant="subtle" text={item.public_key} />
          </TableCell>
          <TableCell>
            <ValidatorStatusBadge status={item.displayedStatus} />
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
  );
};

OperatorValidatorsList.displayName = "OperatorValidatorsList";
