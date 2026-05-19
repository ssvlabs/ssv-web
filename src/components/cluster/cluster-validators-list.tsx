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
import { formatGwei } from "viem";

export const ClusterValidatorsList: FC<ComponentPropsWithoutRef<"div">> = ({
  ...props
}) => {
  const navigate = useNavigate();
  const cluster = useCluster();
  const { validators, infiniteQuery } = useInfiniteClusterValidators();
  const isSsvCluster = !cluster.data?.migrated;

  return (
    <div className="flex flex-col gap-4">
      <ValidatorsSearchAndFilters />
      <VirtualizedInfinityTable
        gridTemplateColumns="200px 140px minmax(100px, auto) 120px"
        {...props}
        query={infiniteQuery}
        headers={[
          <Text>Public Key</Text>,
          <Tooltip
            asChild
            content="Validator's status within the SSV network, primarily based on operator performance over the last 2 epochs, with additional context from its Beacon chain state."
          >
            <div className="flex w-fit gap-2 items-center">
              <Text>Status</Text>
              <FaCircleInfo className="size-3 text-gray-500" />
            </div>
          </Tooltip>,
          <Tooltip asChild content="Each validator's effective balance according to the beacon chain. Operational runway is calculated from the cluster effective balance reported by the oracles.">
            <div className="flex items-center gap-1.5">
              <Text>Effective Balance</Text>
              <FaCircleInfo className="size-3 text-gray-500" />
            </div>
          </Tooltip>,
          null,
        ]}
        items={validators}
        renderRow={({ index, item }) => (
          <TableRow key={index} data-testid={`validator-row-${item.public_key}`}>
            <TableCell className="flex gap-2 items-center">
              <Text variant="body-3-medium">
                {shortenAddress(add0x(item.public_key))}
              </Text>
              <CopyBtn variant="subtle" text={item.public_key} />
            </TableCell>
            <TableCell>
              <ValidatorStatusBadge size="xs" status={item.displayedStatus} />
            </TableCell>
            <TableCell>
              <Text variant="body-3-medium">
                {formatGwei(BigInt(item.validator_info?.effective_balance)) ||
                  32}{" "}
                ETH
              </Text>
            </TableCell>
            <TableCell className="flex gap-0.5 justify-end">
              <SsvExplorerBtn validatorId={item.public_key} />
              <BeaconchainBtn validatorId={item.public_key} />

              {cluster.data && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton aria-label="Validator actions">
                      <HiOutlineCog />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <a
                      href="https://docs.ssv.network/stakers/validators/update-operators"
                      target="_blank"
                      className={cn({ "pointer-events-none": isSsvCluster })}
                    >
                      <DropdownMenuItem disabled={isSsvCluster}>
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
              )}
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
};

ClusterValidatorsList.displayName = "OperatorValidatorsList";
