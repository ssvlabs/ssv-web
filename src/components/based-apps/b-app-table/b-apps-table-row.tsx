import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp, BAppsMetaData } from "@/api/b-app.ts";
import { currencyFormatter } from "@/lib/utils/number.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { getAddress } from "viem";
import { cn } from "@/lib/utils/tw";

type BAppsTableRowProps = {
  bApp: BApp & BAppsMetaData;
  isCreateFlow?: boolean;
  onRowClick?: () => void;
  isClickable?: boolean;
};

const BAppsTableRow = ({
  bApp,
  isCreateFlow,
  onRowClick,
  isClickable = true,
}: BAppsTableRowProps) => {
  const { address } = useAccount();
  const isUsedBApp =
    isCreateFlow &&
    bApp.strategyOwners
      .map((address) => getAddress(address))
      .includes(getAddress(address || "0x"));
  return (
    <TableRow
      key={bApp.id}
      className={cn("max-h-7", {
        "cursor-pointer": isClickable,
        "bg-gray-100 hover:bg-gray-100 text-gray-400": isUsedBApp,
      })}
      onClick={isClickable ? onRowClick : undefined}
    >
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} flex items-center gap-2 ${isUsedBApp && "text-gray-400"}`}
      >
        <img
          className="rounded-[8px] size-7 border-gray-400 border"
          src={bApp?.logo || "/images/operator_default_background/light.svg"}
          onError={(e) => {
            e.currentTarget.src =
              "/images/operator_default_background/light.svg";
          }}
        />
        {bApp.name || shortenAddress(bApp.id)}
      </TableCell>
      <TableCell>
        <AssetsDisplay max={3} addresses={bApp.supportedAssets} />
      </TableCell>
      <TableCell>
        <div className="w-7 h-6 rounded-[4px] border bg-primary-50 border-primary-200 text-primary-600 flex items-center justify-center text-[10px]">
          {bApp.strategies}
        </div>
      </TableCell>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} ${isUsedBApp && "text-gray-400"}`}
      >
        {bApp.delegators}
      </TableCell>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} ${isUsedBApp && "text-gray-400"}`}
      >
        {currencyFormatter.format(Number(bApp.totalDelegatedValue) || 0)}
      </TableCell>
      <TableCell className="p-0">
        {isCreateFlow && (
          <Button
            disabled={isUsedBApp}
            onClick={() => {
              useCreateStrategyContext.state.bApp = bApp;
            }}
            className="text-[14px]"
          >
            {isUsedBApp ? "In Use" : "Select"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BAppsTableRow;
