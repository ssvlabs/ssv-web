import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp } from "@/api/b-app.ts";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";
import { currencyFormatter } from "@/lib/utils/number.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { getAddress } from "viem";

const BAppsTableRow = ({
  bApp,
  isCreateFlow,
  withoutOwnerAddress,
}: {
  bApp: BApp;
  withoutOwnerAddress?: boolean;
  isCreateFlow?: boolean;
}) => {
  const { address } = useAccount();
  const isUsedBApp =
    isCreateFlow &&
    bApp.strategyOwners
      .map((address) => getAddress(address))
      .includes(getAddress(address || "0x"));
  return (
    <TableRow
      key={bApp.id}
      className={`cursor-pointer max-h-7 ${isUsedBApp && "bg-gray-100 hover:bg-gray-100 text-gray-400"}`}
    >
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} flex items-center gap-2 ${isUsedBApp && "text-gray-400"}`}
      >
        <img
          className="rounded-[8px] size-7 border-gray-400 border"
          src={
            bApp.bAppsMetaData.logo ||
            "/images/operator_default_background/light.svg"
          }
          onError={(e) => {
            e.currentTarget.src =
              "/images/operator_default_background/light.svg";
          }}
        />
        {bApp.bAppsMetaData.name || shortenAddress(bApp.id)}
      </TableCell>
      {!withoutOwnerAddress && (
        <TableCell className={`${textVariants({ variant: "body-3-medium" })}`}>
          <div className={`flex justify-start items-center gap-2`}>
            {shortenAddress(bApp.ownerAddress)}
            <CopyBtn
              disabled={isUsedBApp}
              variant="subtle"
              text={bApp.ownerAddress}
            />
          </div>
        </TableCell>
      )}
      <TableCell>
        <AssetsDisplay max={3} addresses={bApp.supportedAssets} />
      </TableCell>
      <TableCell>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
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
