import type { FC, ComponentPropsWithoutRef } from "react";
import { TableHeader, TableHead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { StrategyBAppsTableRow } from "@/components/based-apps/strategy-b-apps-table/strategy-b-apps-table-row.tsx";
import type { BAppAsset, BAppsMetaData, StrategyBApp } from "@/api/b-app.ts";
import { Text } from "@/components/ui/text.tsx";
import { OptInBtn } from "@/app/routes/dashboard/b-app/strategies/opt-in/opt-in-btn.tsx";

export type BAppsTableProps = {
  bApps: (StrategyBApp & BAppsMetaData)[];
  bAppsObligations: BAppAsset[];
  searchValue?: string;
  strategyId?: string;
  isLoading?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof BAppsTableProps> &
    BAppsTableProps
>;

export const StrategyBAppsTable: FCProps = ({
  bApps,
  bAppsObligations,
  searchValue,
  isLoading,
  strategyId,
  className,
  ...props
}) => {
  return (
    <div>
      <Table
        className={cn(
          className,
          `w-full rounded-t-xl overflow-hidden  ${!(!bApps.length && !isLoading) && "rounded-b-[16px]"}`,
        )}
        {...props}
      >
        <TableHeader>
          <TableHead>bApps</TableHead>
          <TableHead className="text-right">Asset</TableHead>
          <TableHead className="w-[10px] text-right"></TableHead>
        </TableHeader>
        {bApps.map((bApp) => {
          const obligations = bAppsObligations.filter((bAppAsset: BAppAsset) =>
            (bAppAsset.obligations || []).some(
              ({ bAppId }) =>
                bAppId.toLowerCase() === bApp.bAppId?.toLowerCase(),
            ),
          );
          const obligationsToMap = obligations.reduce(
            (
              acc: Record<
                `0x${string}`,
                {
                  bAppId: `0x${string}`;
                  percentage: string;
                  percentageProposed: string;
                  percentageProposedTimestamp: string;
                }
              >,
              obligation,
            ) => {
              acc[obligation.token] =
                (obligation.obligations || []).find(
                  (obl: {
                    bAppId: `0x${string}`;
                    percentage: string;
                    percentageProposed: string;
                    percentageProposedTimestamp: string;
                  }) => obl.bAppId.toLowerCase() === bApp.bAppId?.toLowerCase(),
                ) ||
                ({} as {
                  bAppId: `0x${string}`;
                  percentage: string;
                  percentageProposed: string;
                  percentageProposedTimestamp: string;
                });
              return acc;
            },
            {},
          );
          return (
            <StrategyBAppsTableRow
              obligations={obligationsToMap}
              searchValue={searchValue}
              bApp={bApp}
              strategyId={strategyId}
            />
          );
        })}
      </Table>
      {!bApps.length && !isLoading && (
        <div className="bg-gray-50 w-full h-[200px] flex flex-col items-center gap-4 justify-center rounded-b-[16px]">
          <Text variant="body-3-medium">
            This strategy has not yet opted-in to a bApp
          </Text>
          <OptInBtn variant={"default"} />
        </div>
      )}
    </div>
  );
};

StrategyBAppsTable.displayName = "StrategyBAppsTable";
