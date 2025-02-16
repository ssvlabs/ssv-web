import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { Button } from "@/components/ui/button.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { Input } from "@/components/ui/input.tsx";
import { FaRegTrashCan } from "react-icons/fa6";
import { useBApps } from "@/hooks/b-app/use-b-apps.ts";

const ObligationTableRow = ({ obligation }: { obligation: `0x${string}` }) => {
  const { assetsData } = useBApps();
  const { state } = useCreateStrategyContext;
  const { selectedObligations } = useCreateStrategyContext();
  console.log(state.selectedObligations);
  return (
    <TableRow key={obligation} className={"cursor-pointer max-h-7"}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex gap-2">
          <AssetLogo
            assetsData={assetsData}
            address={obligation}
            className="size-6"
          />
          {assetsData[obligation]?.name || "unknown asset"}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {shortenAddress(obligation)}
      </TableCell>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} py-0`}
      >
        <div className="w-full flex justify-end items-center">
          {Object.keys(selectedObligations).includes(obligation) ? (
            <div className="flex gap-1">
              <Input
                onChange={(e) => {
                  let value = Number(e.target.value.replace("%", ""));
                  if (!value) {
                    value = 0;
                  }
                  if (value < 0 || value > 100) {
                    value = selectedObligations[obligation];
                  }
                  state.selectedObligations[obligation] = value;
                }}
                value={selectedObligations[obligation]}
                className="w-14 h-8"
              />
              %
              <div className="size-8 bg-error-50 hover:bg-error-50 flex items-center justify-center">
                <FaRegTrashCan
                  onClick={() => {
                    state.selectedObligations = Object.fromEntries(
                      Object.entries(selectedObligations).filter(
                        ([key]) => key !== obligation,
                      ),
                    );
                  }}
                  className="size-4 text-error-500"
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={() => {
                state.selectedObligations = {
                  ...state.selectedObligations,
                  [obligation]: 0,
                };
              }}
              className={`${textVariants({ variant: "body-3-medium" })} text-white w-[116px] h-[32px]`}
            >
              Add
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ObligationTableRow;
