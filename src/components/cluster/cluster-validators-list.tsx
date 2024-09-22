import type { FC, ComponentPropsWithoutRef } from "react";
import { CopyBtn } from "@/components/ui/copy-btn";
import { TableRow, TableCell } from "@/components/ui/grid-table";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { IconButton } from "@/components/ui/button";
import { LuLogOut, LuSatelliteDish, LuTrash2 } from "react-icons/lu";
import { useLinks } from "@/hooks/use-links";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { HiOutlineCog } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { TbExternalLink, TbRefresh } from "react-icons/tb";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import { Spacer } from "@/components/ui/spacer";

export const ClusterValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const cluster = useCluster();
  const { validators, infiniteQuery } = useInfiniteClusterValidators();
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
        <TableRow key={index}>
          <TableCell className="flex gap-2 items-center">
            <Text variant="body-3-bold">{shortenAddress(item.public_key)}</Text>
            <CopyBtn variant="subtle" text={item.public_key} />
          </TableCell>
          <TableCell>
            <Badge variant="error" size="sm">
              {item.status}
            </Badge>
          </TableCell>
          <TableCell className="flex gap-0.5 justify-end">
            <SsvExplorerBtn validatorId={item.public_key} />
            <IconButton
              as="a"
              href={`${links.beaconcha}/validator/${item.public_key}`}
              target="_blank"
            >
              <LuSatelliteDish />
            </IconButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton>
                  <HiOutlineCog />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <a
                  href="https://docs.ssv.network/learn/stakers/validators/update-operators"
                  target="_blank"
                >
                  <DropdownMenuItem>
                    <TbRefresh className="size-4" />
                    <span>Change Operators</span>
                    <Spacer />
                    <TbExternalLink className="size-3" />
                  </DropdownMenuItem>
                </a>
                <Link
                  to="remove/confirmation"
                  onClick={() =>
                    (useBulkActionContext.state.selectedPublicKeys = [
                      item.public_key,
                    ])
                  }
                >
                  <DropdownMenuItem>
                    <LuTrash2 className="size-4" />
                    <span>Remove Validators</span>
                  </DropdownMenuItem>
                </Link>
                <Tooltip
                  side="bottom"
                  delayDuration={350}
                  content={
                    cluster.data?.isLiquidated
                      ? "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed."
                      : undefined
                  }
                >
                  <Link
                    to="exit/confirmation"
                    onClick={() =>
                      (useBulkActionContext.state.selectedPublicKeys = [
                        item.public_key,
                      ])
                    }
                  >
                    <DropdownMenuItem disabled={cluster.data?.isLiquidated}>
                      <LuLogOut className="size-4" />
                      <span>Exit Validators</span>
                    </DropdownMenuItem>
                  </Link>
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )}
    />
  );
};

ClusterValidatorsList.displayName = "OperatorValidatorsList";
