import type { FC, ComponentPropsWithoutRef } from "react";
import { CopyBtn } from "@/components/ui/copy-btn";
import { TableRow, TableCell } from "@/components/ui/grid-table";
import {
  BeaconchainBtn,
  SsvExplorerBtn,
} from "@/components/ui/ssv-explorer-btn";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { Text } from "@/components/ui/text";
import { IconButton } from "@/components/ui/button";
import { LuLogOut, LuTrash2 } from "react-icons/lu";
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
import { useNavigate } from "react-router-dom";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { TbExternalLink, TbRefresh } from "react-icons/tb";
import { useBulkActionContext } from "@/guard/bulk-action-guard";
import { Spacer } from "@/components/ui/spacer";
import { ValidatorStatusBadge } from "@/components/cluster/validator-status-badge";
import { ValidatorsSearchAndFilters } from "@/components/cluster/validators-search-and-filters";

export const ClusterValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const navigate = useNavigate();
  const cluster = useCluster();
  const { validators, infiniteQuery } = useInfiniteClusterValidators();

  return (
    <div className="flex flex-col gap-4">
      <ValidatorsSearchAndFilters />
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
                {shortenAddress(add0x(item.public_key))}
              </Text>
              <CopyBtn variant="subtle" text={item.public_key} />
            </TableCell>
            <TableCell>
              <ValidatorStatusBadge size="sm" status={item.displayedStatus} />
            </TableCell>
            <TableCell className="flex gap-0.5 justify-end">
              <SsvExplorerBtn validatorId={item.public_key} />
              <BeaconchainBtn validatorId={item.public_key} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton>
                    <HiOutlineCog />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <a
                    href="https://docs.ssv.network/stakers/validators/update-operators"
                    target="_blank"
                  >
                    <DropdownMenuItem>
                      <TbRefresh className="size-4" />
                      <span>Change Operators</span>
                      <Spacer />
                      <TbExternalLink className="size-3" />
                    </DropdownMenuItem>
                  </a>
                  <DropdownMenuItem
                    onClick={() => {
                      useBulkActionContext.state.selectedPublicKeys = [
                        item.public_key,
                      ];
                      navigate("remove/confirmation");
                    }}
                  >
                    <LuTrash2 className="size-4" />
                    <span>Remove Validator</span>
                  </DropdownMenuItem>
                  <Tooltip
                    side="bottom"
                    delayDuration={350}
                    asChild
                    content={
                      cluster.data?.isLiquidated
                        ? "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed."
                        : undefined
                    }
                  >
                    <DropdownMenuItem
                      disabled={cluster.data?.isLiquidated}
                      onClick={() => {
                        useBulkActionContext.state.selectedPublicKeys = [
                          item.public_key,
                        ];
                        navigate("exit/confirmation");
                      }}
                    >
                      <LuLogOut className="size-4" />
                      <span>Exit Validator</span>
                    </DropdownMenuItem>
                  </Tooltip>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
};

ClusterValidatorsList.displayName = "OperatorValidatorsList";
