import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils/tw.ts";
import { textVariants } from "@/components/ui/text.tsx";
import { AddressDisplay } from "@/components/ui/address.tsx";
import { convertToPercentage } from "@/lib/utils/number.ts";
import type { BAppsMetaData, StrategyBApp } from "@/api/b-app.ts";
import { useManageObligation } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/use-manage-obligation.ts";
import { Tooltip } from "@/components/ui/tooltip.tsx";

const InnerTableRow = ({
  bApp,
  obligation,
  strategyId,
  token,
}: {
  bApp: StrategyBApp & BAppsMetaData;
  token: `0x${string}`;
  strategyId: string;
  obligation: {
    bAppId: `0x${string}`;
    percentage: string;
    percentageProposed: string;
    percentageProposedTimestamp: string;
  };
}) => {
  const { isPending, isWaiting } = useManageObligation(
    strategyId,
    bApp.bAppId,
    token,
  );

  return (
    <TableRow
      key={bApp.bAppId}
      className={cn(
        "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
        {
          "bg-[#FD9D2F0A]": isPending || isWaiting,
        },
      )}
    >
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className={cn("flex items-center gap-2 ", {})}>
          <img
            className="rounded-[8px] size-7 border-gray-400 border"
            src={bApp?.logo || "/images/operator_default_background/light.svg"}
            onError={(e) => {
              e.currentTarget.src =
                "/images/operator_default_background/light.svg";
            }}
          />
          {bApp?.name || <AddressDisplay address={bApp.bAppId} copyable />}
        </div>
      </TableCell>
      <TableCell />
      <TableCell />
      <TableCell
        className={cn(
          `${textVariants({ variant: "body-3-medium" })} flex items-center justify-end`,
          {
            "text-[#FD9D2F]": isPending || isWaiting,
          },
        )}
      >
        <Tooltip
          children={`${convertToPercentage(obligation.percentage)}%`}
          content={`Pending obligation change to ${convertToPercentage(obligation.percentageProposed)}%.`}
        />
      </TableCell>
    </TableRow>
  );
};

export default InnerTableRow;
