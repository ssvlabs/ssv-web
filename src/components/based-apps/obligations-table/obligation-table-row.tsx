import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { Input } from "@/components/ui/input.tsx";
import { FaRegTrashCan } from "react-icons/fa6";
import { Text } from "@/components/ui/text.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import { useLinks } from "@/hooks/use-links.ts";
import { AddressDisplay } from "@/components/ui/address";
import { ObligateBtn } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/obligate-btn.tsx";
import { IoMdCloseCircle } from "react-icons/io";
import { PiDotsThreeCircleDuotone } from "react-icons/pi";
import { FaArrowCircleUp } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { useManageObligationsModal } from "@/signals/modal.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { formatDistance } from "date-fns";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import type { BAppAsset } from "@/api/b-app.ts";
import { cn } from "@/lib/utils/tw.ts";
import { useManageObligation } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/use-manage-obligation.ts";
import { getObligationData } from "@/lib/utils/manage-obligation.ts";

const ObligationTableRow = ({
  obligation,
  strategyId,
  isObligationManage,
}: {
  obligation: `0x${string}`;
  strategyId: string;
  isObligationManage?: boolean;
}) => {
  const { state } = useCreateStrategyContext;
  const { selectedObligations } = useCreateStrategyContext();
  const { etherscan } = useLinks();
  const modal = useManageObligationsModal();
  const strategyData = useStrategy(modal.meta.strategyId);
  const { strategy } = strategyData;

  const obligations = (strategy.depositsPerToken || []).filter(
    (bAppAsset: BAppAsset) =>
      (bAppAsset.obligations || []).some(
        ({ bAppId }) =>
          bAppId.toLowerCase() === modal.meta.bAppId?.toLowerCase(),
      ),
  );
  const { isPending, isPendingEnd, isFinalizeEnd, isWaiting, isExpired } =
    useManageObligation(
      modal.meta.strategyId || "",
      modal.meta.bAppId || "",
      obligation,
    );
  const tokenObligation = getObligationData(
    obligations,
    obligation,
    modal.meta.bAppId || "0x",
  );

  return (
    <TableRow key={obligation} className={"max-h-7"}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex gap-2">
          <AssetLogo address={obligation} className="size-6" />
          <AssetName address={obligation} />
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <AddressDisplay
          copyable
          address={obligation}
          linkProps={{
            to: `${etherscan}/token/${obligation}`,
            className: "text-primary-500",
            target: "_blank",
          }}
        />
      </TableCell>
      {isObligationManage && (
        <TableCell
          className={cn("text-right", {
            "text-secondary-sunshineLight": isPending,
            "text-success-500": isWaiting,
          })}
        >
          {tokenObligation?.percentage
            ? `${convertToPercentage(tokenObligation?.percentage || "")}%`
            : "-"}
        </TableCell>
      )}
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} py-0`}
      >
        {isObligationManage ? (
          <div className="w-full flex flex-row-reverse justify-between items-center">
            <ObligateBtn
              className={`w-[116px] h-[32px]`}
              strategyId={strategyId}
              token={obligation}
              obligationUpdateData={{
                isObligated: Number(tokenObligation?.percentage || 0) > 0,
                isPending,
                isPendingEnd,
                isExpired,
                isFinalizeEnd,
                isWaiting,
              }}
            />
            {isExpired && (
              <Tooltip content={"Obligation change request expired"}>
                <IoMdCloseCircle className="size-5 text-gray-500" />
              </Tooltip>
            )}
            {isPending && (
              <Tooltip
                content={
                  <div>
                    <Text>
                      Pending change obligation to{" "}
                      {convertToPercentage(
                        tokenObligation?.percentageProposed || 0,
                      )}
                      %
                    </Text>
                    <Text>
                      Remaining time:{" "}
                      {formatDistance(isPendingEnd, Date.now(), {
                        addSuffix: false,
                      })}
                      .
                    </Text>
                  </div>
                }
              >
                <PiDotsThreeCircleDuotone className="size-5 text-[#FD9D2F]" />
              </Tooltip>
            )}
            {isWaiting && (
              <Tooltip
                content={
                  <div>
                    <Text>
                      Obligation change to{" "}
                      {convertToPercentage(
                        tokenObligation?.percentageProposed || 0,
                      )}
                      % is executable.
                    </Text>
                    <Text>
                      Expiring in:{" "}
                      {formatDistance(isFinalizeEnd, Date.now(), {
                        addSuffix: false,
                      })}
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
                className={`${textVariants({ variant: "body-3-medium" })} text-[#ffffff] w-[116px] h-[32px]`}
              >
                Add
              </Button>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ObligationTableRow;
