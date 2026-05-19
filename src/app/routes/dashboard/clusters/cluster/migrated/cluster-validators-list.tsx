import type { ComponentPropsWithoutRef, FC } from "react";
import { CopyBtn } from "@/components/ui/copy-btn";
import { TableCell, TableRow } from "@/components/ui/grid-table";
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
import { cn } from "@/lib/utils/tw.ts";

export const ClusterValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const navigate = useNavigate();
  const cluster = useCluster();
  const { validators, infiniteQuery } = useInfiniteClusterValidators();
  const isSsvCluster = !cluster.data?.migrated;

  return (
    <div
      data-testid="dashboard-cluster-validators-list"
      className="flex flex-col gap-4"
    >
      <ValidatorsSearchAndFilters />
      <VirtualizedInfinityTable
        gridTemplateColumns="220px minmax(200px, auto) 120px"
        {...props}
        query={infiniteQuery}
        headers={[
          <Text>Public key</Text>,
          <Tooltip
            asChild
            content="Validator's status within the SSV network, primarily based on operator performance over the last 2 epochs, with additional context from its Beacon chain state."
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
            data-testid="dashboard-cluster-validators-row"
            data-testid-index={index}
            data-testid-entity={item.public_key}
            key={index}
          >
            <TableCell className="flex gap-2 items-center">
              <Text
                data-testid="dashboard-cluster-validators-row-pubkey"
                variant="body-2-medium"
              >
                {shortenAddress(add0x(item.public_key))}
              </Text>
              <CopyBtn
                data-testid="dashboard-cluster-validators-row-pubkey-copy-btn"
                variant="subtle"
                text={item.public_key}
              />
            </TableCell>
            <TableCell>
              <ValidatorStatusBadge
                data-testid="dashboard-cluster-validators-row-status"
                size="sm"
                status={item.displayedStatus}
              />
            </TableCell>
            <TableCell className="flex gap-0.5 justify-end">
              <SsvExplorerBtn
                data-testid="dashboard-cluster-validators-row-explorer-btn"
                validatorId={item.public_key}
              />
              <BeaconchainBtn
                data-testid="dashboard-cluster-validators-row-beaconchain-btn"
                validatorId={item.public_key}
              />

              {cluster.data && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton data-testid="dashboard-cluster-validators-row-actions-trigger">
                      <HiOutlineCog />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <a
                      href="https://docs.ssv.network/stakers/validators/update-operators"
                      target="_blank"
                      className={cn({ "pointer-events-none": isSsvCluster })}
                    >
                      <DropdownMenuItem
                        data-testid="dashboard-cluster-validators-row-change-operators-item"
                        disabled={isSsvCluster}
                      >
                        <TbRefresh className="size-4" />
                        <span>Change Operators</span>
                        <Spacer />
                        <TbExternalLink className="size-3" />
                      </DropdownMenuItem>
                    </a>
                    <DropdownMenuItem
                      data-testid="dashboard-cluster-validators-row-remove-item"
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
                        data-testid="dashboard-cluster-validators-row-exit-item"
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
              )}
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
};

ClusterValidatorsList.displayName = "OperatorValidatorsList";
