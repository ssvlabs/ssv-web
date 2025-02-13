import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import type { BApp } from "@/api/b-app.ts";
import { useBApps } from "@/hooks/b-app/use-b-apps.ts";

const BAppsTableRow = ({
  bApp,
  isCreateFlow,
}: {
  bApp: BApp;
  isCreateFlow?: boolean;
}) => {
  const { assetsData } = useBApps();

  // console.log(bApp);
  return (
    <TableRow key={bApp.id} className={"cursor-pointer max-h-7"}>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} flex items-center gap-2`}
      >
        <img
          className="rounded-[8px] size-7 border-gray-400 border"
          src={"/images/operator_default_background/light.svg"}
        />
        metadata
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {shortenAddress(bApp.ownerAddress)}
      </TableCell>
      <TableCell>
        <AssetsDisplay
          max={3}
          assetsData={assetsData}
          addresses={bApp.supportedAssets}
        />
      </TableCell>
      <TableCell>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          {bApp.strategies}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {bApp.delegators}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {bApp.totalDelegatedValue}
      </TableCell>
      <TableCell className="p-0">
        {isCreateFlow && (
          <Button
            onClick={() => {
              useCreateStrategyContext.state.bApp = bApp;
            }}
            className={`${textVariants({ variant: "body-3-medium" })} text-white`}
          >
            Select
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BAppsTableRow;
