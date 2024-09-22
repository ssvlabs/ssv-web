import type { FC, ComponentPropsWithoutRef } from "react";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import type { Validator } from "@/types/api";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { TableCell, TableRow } from "@/components/ui/grid-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Button } from "@/components/ui/button";
import { LuSatelliteDish } from "react-icons/lu";
import { useLinks } from "@/hooks/use-links";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { cn } from "@/lib/utils/tw";
import { Checkbox } from "@/components/ui/checkbox";

export type BulkValidatorPickerProps = {
  selectedValidatorsPKs: Validator["public_key"][];
  onCheckedChange: (
    validatorPK: Validator["public_key"],
    checked: boolean,
  ) => void;
};

type BulkValidatorPickerFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof BulkValidatorPickerProps> &
    BulkValidatorPickerProps
>;

export const BulkValidatorPicker: BulkValidatorPickerFC = ({
  className,
  selectedValidatorsPKs,
  onCheckedChange,
  ...props
}) => {
  const links = useLinks();
  const { validators, infiniteQuery } = useInfiniteClusterValidators();

  return (
    <VirtualizedInfinityTable
      gridTemplateColumns="40px 220px minmax(200px, auto) 120px"
      {...props}
      query={infiniteQuery}
      className={cn(className, "min-h-96")}
      headers={[
        <Checkbox />,
        <Text>Public key</Text>,
        <Tooltip
          asChild
          content="Refers to the validators status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties(according to the last 2 epochs)"
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
        <TableRow
          as="label"
          className="select-none"
          htmlFor={item.public_key}
          key={index}
          clickable
        >
          <TableCell className="flex gap-2 items-center">
            <Checkbox
              id={item.public_key}
              checked={selectedValidatorsPKs.includes(item.public_key)}
              onCheckedChange={(checked) =>
                onCheckedChange(item.public_key, Boolean(checked))
              }
            />
          </TableCell>
          <TableCell className="flex gap-2 items-center">
            <Text variant="body-3-bold">{shortenAddress(item.public_key)}</Text>
            <CopyBtn variant="subtle" text={item.public_key} />
          </TableCell>
          <TableCell>
            <Badge variant="error" size="sm">
              {item.status}
            </Badge>
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

BulkValidatorPicker.displayName = "BulkValidatorPicker";
