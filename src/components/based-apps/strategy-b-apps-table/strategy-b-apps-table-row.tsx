import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import type { Address } from "abitype";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import type { BAppsMetaData, StrategyBApp } from "@/api/b-app.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import { TbExternalLink } from "react-icons/tb";
import { useLinks } from "@/hooks/use-links.ts";
import ExpandButton from "@/components/ui/expand-button.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ManageObligationsBtn } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/manage-obligations-btn.tsx";
import {
  getFirstPendingOrWaitingObligation,
  getPendingObligationsCount,
} from "@/lib/utils/manage-obligation.ts";
import { useObligationTimelockPeriod } from "@/lib/contract-interactions/b-app/read/use-obligation-timelock-period.ts";
import { useObligationExpireTime } from "@/lib/contract-interactions/b-app/read/use-obligation-expire-time.ts";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { IoMdCloseCircle } from "react-icons/io";
import { formatDistance } from "date-fns";
import { PiDotsThreeCircleDuotone } from "react-icons/pi";
import { FaArrowCircleUp } from "react-icons/fa";

export type BAppTableRowProps = {
  bApp: StrategyBApp & BAppsMetaData;
  obligations: Record<
    Address,
    {
      bAppId: Address;
      percentage: string;
      percentageProposed: string;
      percentageProposedTimestamp: string;
    }
  >;
  searchValue?: string;
  strategyId?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof BAppTableRowProps> &
    BAppTableRowProps
>;

export const StrategyBAppsTableRow: FCProps = ({
  bApp,
  obligations,
  searchValue,
  strategyId,
  className,
  ...props
}) => {
  const { etherscan } = useLinks();
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const [onRowHover, setOnRowHover] = useState(false);
  const obligationTimelockPeriod = useObligationTimelockPeriod();
  const obligationExpiredPeriod = useObligationExpireTime();
  const { strategy } = useStrategy(strategyId);
  const { address } = useAccount();
  const isOwner =
    address?.toLowerCase() === strategy.ownerAddress?.toLowerCase();
  if (
    searchValue &&
    ((bApp.name &&
      !bApp.name.toLowerCase().includes(searchValue.toLowerCase())) ||
      !bApp.bAppId.toLowerCase().includes(searchValue.toLowerCase()))
  ) {
    return;
  }

  const count = getPendingObligationsCount({
    obligations: Object.values(obligations) || [],
    timeLockPeriod: obligationTimelockPeriod.data || 0,
    expiredPeriod: obligationExpiredPeriod.data || 0,
  });

  const pendingObligation = getFirstPendingOrWaitingObligation({
    obligations,
    timeLockPeriod: obligationTimelockPeriod.data || 0,
    expiredPeriod: obligationExpiredPeriod.data || 0,
  });

  return (
    <TableBody>
      <TableRow
        onMouseEnter={() => setOnRowHover(true)}
        onMouseLeave={() => setOnRowHover(false)}
        className={cn("cursor-pointer max-h-7", className)}
        {...props}
      >
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <Link
            to={`/account/bApps/${bApp.bAppId}`}
            className="flex items-center gap-2 text-primary-500"
          >
            <img
              className="rounded-[8px] size-7 border-gray-400 border"
              src={
                bApp?.logo || "/images/operator_default_background/light.svg"
              }
              onError={(e) => {
                e.currentTarget.src =
                  "/images/operator_default_background/light.svg";
              }}
            />
            <Button variant="link">
              {bApp?.name || shortenAddress(bApp.bAppId)}
            </Button>
          </Link>
        </TableCell>
        <TableCell className="flex justify-end items-center ">
          {onRowHover && isOwner ? (
            <ManageObligationsBtn
              obligations={obligations}
              strategyId={strategyId || ""}
              bAppId={bApp.bAppId}
            />
          ) : (
            <AssetsDisplay
              max={3}
              addresses={bApp.tokens.map((s) => s) as Address[]}
            />
          )}
          {/*will use in future*/}
          {false && Boolean(bApp.assets.length) && (
            <ExpandButton setIsOpen={setIsInnerOpen} isOpen={isInnerOpen} />
          )}
        </TableCell>
        <TableCell>
          {isOwner && count === 1 ? (
            <div>
              {pendingObligation?.isExpired && (
                <Tooltip content={"Obligation change request expired"}>
                  <IoMdCloseCircle className="size-5 text-gray-500" />
                </Tooltip>
              )}
              {pendingObligation?.isPending && (
                <Tooltip
                  content={
                    <div>
                      <Text>
                        Pending change obligation to{" "}
                        {convertToPercentage(
                          obligations[pendingObligation.key as Address]
                            ?.percentageProposed || 0,
                        )}
                        %
                      </Text>
                      <Text>
                        Remaining time:{" "}
                        {formatDistance(
                          pendingObligation.isPendingEnd,
                          Date.now(),
                          {
                            addSuffix: false,
                          },
                        )}
                        .
                      </Text>
                    </div>
                  }
                >
                  <PiDotsThreeCircleDuotone className="size-5 text-[#FD9D2F]" />
                </Tooltip>
              )}
              {pendingObligation?.isWaiting && (
                <Tooltip
                  content={
                    <div>
                      <Text>
                        Obligation change to{" "}
                        {convertToPercentage(
                          obligations[pendingObligation.key as Address]
                            ?.percentageProposed || 0,
                        )}
                        % is executable.
                      </Text>
                      <Text>
                        Expiring in:{" "}
                        {formatDistance(
                          pendingObligation.isFinalizeEnd,
                          Date.now(),
                          {
                            addSuffix: false,
                          },
                        )}
                        .
                      </Text>
                    </div>
                  }
                >
                  <FaArrowCircleUp className="size-5 text-success-500" />
                </Tooltip>
              )}
            </div>
          ) : (
            count > 0 && (
              <Tooltip
                asChild
                content={`Pending ${count} changes`}
                children={
                  <div
                    className={
                      "size-6 bg-primary-400 border-[2px] border-primary-500 p-[6px] flex items-center justify-center text-white rounded-[4px] text-xs"
                    }
                  >
                    {count}
                  </div>
                }
              />
            )
          )}
        </TableCell>
      </TableRow>
      {isInnerOpen && (
        <TableRow
          className={cn(
            "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
            className,
          )}
          {...props}
        >
          <TableCell
            className={`${textVariants({ variant: "caption-medium" })} text-gray-500`}
          >
            Asset
          </TableCell>
          <TableCell
            className={`${textVariants({ variant: "caption-medium" })} flex items-center justify-end text-gray-500`}
          >
            β
          </TableCell>
        </TableRow>
      )}
      {Boolean(bApp.assets.length) &&
        isInnerOpen &&
        bApp.assets.map(({ token, beta }) => (
          <TableRow
            className={cn(
              "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
              className,
            )}
            {...props}
          >
            <TableCell className={textVariants({ variant: "body-3-medium" })}>
              <div className="flex items-center gap-2">
                <AssetLogo address={token} />
                <AssetName address={token} />
                <a target="_blank" href={`${etherscan}/token/${token}`}>
                  <TbExternalLink className="size-3" />
                </a>
              </div>
            </TableCell>
            <TableCell
              className={`${textVariants({ variant: "body-3-medium" })} flex items-center justify-end`}
            >
              {convertToPercentage(beta)}
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  );
};

StrategyBAppsTableRow.displayName = "StrategyBAppsTableRow";
