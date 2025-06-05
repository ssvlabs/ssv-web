import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type FC } from "react";
import { useManageObligationsModal } from "@/signals/modal.ts";
import Obligations from "@/app/routes/dashboard/b-app/strategies/obligations.tsx";
import { useBApp } from "@/hooks/b-app/use-b-app.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { Text } from "@/components/ui/text.tsx";
import { IconButton } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import type { BApp, BAppAsset } from "@/api/b-app.ts";
import { ObligateModal } from "@/app/routes/dashboard/b-app/strategies/manage-obligations/obligate-modal.tsx";
import { convertToPercentage } from "@/lib/utils/number.ts";

export type ManageObligationsModalProps = {
  // TODO: Add props or remove this type
};

export const ManageObligationsModal: FC<ManageObligationsModalProps> = () => {
  const modal = useManageObligationsModal();
  const bApp = useBApp(modal.meta.bAppId);
  const { strategy } = useStrategy(modal.meta.strategyId);

  const closeModal = () => {
    useCreateStrategyContext.state.bApp = {} as BApp;
    useCreateStrategyContext.state.selectedObligations = {};
    modal.close();
  };
  if (modal.isOpen && !bApp.isLoading) {
    const obligations = (strategy.depositsPerToken || []).filter(
      (bAppAsset: BAppAsset) =>
        (bAppAsset.obligations || []).some(
          ({ bAppId }) =>
            bAppId.toLowerCase() === modal.meta.bAppId?.toLowerCase(),
        ),
    );
    const obligationsToMap = obligations.reduce(
      (acc: Record<`0x${string}`, number>, obligation) => {
        acc[obligation.token] = convertToPercentage(
          obligation.totalObligatedPercentage || "",
        );
        return acc;
      },
      {},
    );
    useCreateStrategyContext.state.bApp = bApp.bApp;
    useCreateStrategyContext.state.selectedObligations = obligationsToMap;
  }

  return (
    <Dialog {...modal}>
      <DialogContent
        asChild
        className="max-w-[1520px] h-[90%] bg-gray-200 p-0 overflow-y-auto "
      >
        <div className="flex flex-col gap-3.5">
          <div className="fixed w-full flex justify-between items-center pl-8 pr-7 h-20 bg-gray-100">
            <Text variant={"body-1-bold"}>
              {strategy.name || `Strategy ${strategy.id}`}
            </Text>
            <div className="flex justify-between items-center gap-8">
              <IconButton
                variant="ghost"
                onClick={closeModal}
                className="text-gray-900 flex items-center justify-center right-0 top-0"
              >
                <X className="text-gray-900 size-4" />
              </IconButton>
            </div>
          </div>
          {modal.isOpen && (
            <div className="mt-[80px] mb-[80px] overflow-auto">
              {bApp.isLoading ? (
                <Spinner />
              ) : (
                <Obligations isNotWizard isObligationManage />
              )}
            </div>
          )}
          <ObligateModal />
        </div>
      </DialogContent>
    </Dialog>
  );
};

ManageObligationsModal.displayName = "ManageObligationsModal";
