import { Button } from "@/components/ui/button";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import { StepperDot } from "@/components/ui/stepper";
import { Text } from "@/components/ui/text";
import { useLinks } from "@/hooks/use-links";
import { cn } from "@/lib/utils/tw";
import { useTransactionModal } from "@/signals/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, FC } from "react";

export type TransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof TransactionModalProps> &
    TransactionModalProps
>;

export const TransactionModal: FCProps = () => {
  const { meta, isOpen } = useTransactionModal();
  const { etherscan } = useLinks();
  const isTwoStep = meta.variant === "2-step";

  const isPending = !isTwoStep || meta.step === "pending";
  const isIndexing = meta.step === "indexing";

  const loaderSrc = isPending
    ? "/images/ssv-loader.svg"
    : "/images/ssv-loader-horizontal.svg";

  const description = isPending
    ? "Your transaction is pending on the blockchain - please wait while it's being confirmed"
    : "Your transaction is being indexed on the SSV Network - please wait while it's processed";

  return (
    <Dialog isOpen={isOpen}>
      <DialogContent className="flex bg-gray-50 flex-col gap-8 max-w-[424px] font-medium ">
        <div className="flex flex-col gap-3">
          <DialogTitle>
            <Text variant="headline4">Sending Transaction</Text>
          </DialogTitle>
          <Text variant="body-2-medium">{description}</Text>
        </div>
        <img src={loaderSrc} className="size-28 mx-auto" />
        {isTwoStep && (
          <div className="flex  w-[244px] mx-auto">
            <div className="flex flex-col items-center gap-1">
              <StepperDot
                className=""
                disabled={isIndexing}
                variant={isPending ? "active" : "done"}
              />
              <Text
                variant="body-3-medium"
                className={cn({
                  "border-gray-400": isIndexing,
                  "opacity-30": isIndexing,
                })}
              >
                Pending{isPending ? "..." : ""}
              </Text>
            </div>
            <Divider className="flex-1 mt-3" />
            <div className="flex flex-col items-center gap-1">
              <StepperDot
                disabled={isPending}
                variant={isPending || isIndexing ? "active" : "done"}
                className={cn("", {
                  "border-gray-400": isPending,
                  "opacity-30": isPending,
                })}
              />
              <Text
                className={cn({
                  "opacity-30": isPending,
                })}
                variant="body-3-medium"
              >
                Indexing{isIndexing ? "..." : ""}
              </Text>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Text variant="body-3-medium" className="text-gray-500">
              Transaction Hash
            </Text>
            <div className="flex items-center h-[50px] px-5 pr-2 py-3 border border-gray-300 rounded-xl">
              <Text
                variant="body-2-medium"
                className="flex-1 text-ellipsis overflow-hidden mr-3"
              >
                {meta.hash}
              </Text>
              <CopyBtn text={meta.hash} className="size-8" />
            </div>
          </div>
          <Button
            as="a"
            target="_blank"
            variant="link"
            href={`${etherscan}/tx/${meta.hash}`}
            className="w-full text-center"
          >
            View Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

TransactionModal.displayName = "TransactionModal";
