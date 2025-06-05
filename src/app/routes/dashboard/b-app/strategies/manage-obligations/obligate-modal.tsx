import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type FC } from "react";
import { useObligateModal } from "@/signals/modal.ts";
// import { useBApp } from "@/hooks/b-app/use-b-app.ts";
import { Text } from "@/components/ui/text.tsx";
import { Button, IconButton } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import { Stepper } from "@/components/ui/stepper.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import type { Address } from "abitype";
import AssetName from "@/components/ui/asset-name.tsx";
import { useBApp } from "@/hooks/b-app/use-b-app.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import Slider from "@/components/ui/custom-slider.tsx";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input.tsx";
// import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";

export type ObligateModalProps = {
  // TODO: Add props or remove this type
};

export const ObligateModal: FC<ObligateModalProps> = () => {
  const modal = useObligateModal();
  const { bApp } = useBApp(modal.meta.bAppId);
  console.log(bApp);
  // if (modal.isOpen && !bApp.isLoading) {
  // console.log(bApp);
  //   useCreateStrategyContext.state.bApp = bApp.bApp;
  // }
  // console.log(useCreateStrategyContext.state);
  return (
    <Dialog {...modal}>
      <DialogContent asChild className="max-w-[648px] h-[764px] bg-white p-6">
        <div className="w-full h-full flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <Text variant={"body-1-bold"}>Change Obligation</Text>

            <div className="flex justify-between items-center gap-8">
              <IconButton
                variant="ghost"
                onClick={() => modal.close()}
                className="text-gray-900 flex items-center justify-center right-0 top-0"
              >
                <X className="text-gray-900 size-5" />
              </IconButton>
            </div>
          </div>
          <div>
            <Stepper
              stepIndex={0}
              steps={[
                {
                  label: "Request",
                  addon: <Text className="text-xs font-bold">Request</Text>,
                },
                {
                  label: "Pending",
                  addon: (
                    <Text className="text-xs font-bold text-primary-500">
                      Pending
                    </Text>
                  ),
                },
                {
                  label: "Change",
                  addon: (
                    <Text className="text-xs font-bold text-primary-500">
                      Change
                    </Text>
                  ),
                },
              ]}
              // className={cn(className)}
            />
          </div>
          <div className="w-full h-full flex flex-col gap-2">
            <Text>Changing an obligation takes effect in multiple steps:</Text>
            <Text>
              The process starts by requesting a new obligation percentage,
              which is followed by pending period. Once the pending period has
              elapsed, you can finalize the new obligation by executing it.
              Percentage change limits apply. Learn more
            </Text>
          </div>
          <div>
            <Text variant="caption-medium" className="text-gray-500">
              Selected bApp
            </Text>
            <div className="flex gap-2 items-center px-6 w-full h-[52px] bg-gray-100 rounded-[12px]">
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
              {bApp?.name || shortenAddress(bApp?.id || "0x")}
            </div>
          </div>
          <div>
            <Text variant="caption-medium" className="text-gray-500">
              Asset
            </Text>
            <div className="flex gap-2 items-center px-6 w-full h-[52px] bg-gray-100 rounded-[12px]">
              <AssetLogo address={modal.meta.token as Address} />
              <AssetName
                className="font-[14px]"
                address={modal.meta.token as Address}
              />
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-300" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <NumericFormat
                className="w-[140px] text-center h-[80px] text-[28px] flex items-center justify-center bg-gray-100 border border-primary-500 rounded-[12px] overflow-hidden [&>input]:text-center"
                value={1}
                decimalScale={2}
                allowLeadingZeros={false}
                // isAllowed={numberFormatLimiter({
                //   setter: setDelegatePercent,
                //   100,
                // })}
                // onValueChange={(values) =>
                //   setDelegatePercent(values.floatValue || 0)
                // }
                customInput={Input}
                suffix="%"
              />
              <Text variant={"caption-medium"} className="text-gray-500">
                Delegate
              </Text>
            </div>
            <Slider maxValue={100} setValue={() => null} value={1} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-[140px] h-[80px] text-[28px] text-gray-5004 flex items-center justify-center bg-gray-100 rounded-[12px] text-gray-500">
                {((100 * 100 + 100 * 100) / 100).toFixed(2)}%
              </div>
              <Text variant={"caption-medium"} className="text-gray-500">
                Available
              </Text>
            </div>
          </div>
          <Button>Request Obligation Change</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ObligateModal.displayName = "ObligateModal";
