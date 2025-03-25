import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { Button } from "@/components/ui/button.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { Input } from "@/components/ui/input.tsx";
import { FaRegTrashCan } from "react-icons/fa6";
import { Text } from "@/components/ui/text.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";
import { useLinks } from "@/hooks/use-links.ts";

const ObligationTableRow = ({ obligation }: { obligation: `0x${string}` }) => {
  const { state } = useCreateStrategyContext;
  const { selectedObligations } = useCreateStrategyContext();
  const { etherscan } = useLinks();

  return (
    <TableRow key={obligation} className={"max-h-7"}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex gap-2">
          <AssetLogo address={obligation} className="size-6" />
          <AssetName address={obligation} />
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className={`flex items-center gap-2`}>
          <Button
            as="a"
            target="_blank"
            variant="link"
            href={`${etherscan}/token/${obligation}`}
          >
            {shortenAddress(obligation)}
          </Button>
          <CopyBtn variant="subtle" text={obligation} />
        </div>
      </TableCell>
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} py-0`}
      >
        <div className="w-full flex justify-end items-center">
          {Object.keys(selectedObligations).includes(obligation) ? (
            <div className="flex gap-1">
              <Input
                type={"number"}
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
                value={`${selectedObligations[obligation]}`}
                className="w-20 h-8"
                rightSlot={<Text className="ml--4">%</Text>}
              />
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
