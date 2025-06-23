import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useBatchTransactionMachine } from "@/lib/machines/batch-transactions/context";
import { shortenAddress } from "@/lib/utils/strings";
import { X } from "lucide-react";
import type { FC } from "react";
import { Collapse } from "react-collapse";
import { AnimatePresence, motion } from "framer-motion";
import { Span, textVariants } from "@/components/ui/text";
import { Spacer } from "@/components/ui/spacer";
import { useKeyPressEvent } from "react-use";
import { useLinks } from "@/hooks/use-links";
import { TbExternalLink } from "react-icons/tb";

export type BatchTransactionModalProps = {
  // TODO: Add props or remove this type
};

const statusIcons = {
  ["idle"]: (
    <img className="size-9" src={"/images/rectangle.svg"} alt="Step Done" />
  ),
  ["pending"]: (
    <div className="size-9 flex items-center justify-center">
      <Spinner className="min-w-10 min-h-10" />
    </div>
  ),
  ["success"]: (
    <img className="size-9" src={"/images/step-done.svg"} alt="Step Done" />
  ),
  ["failed"]: (
    <img className="size-9" src={"/images/step-failed.svg"} alt="Step Done" />
  ),
};

export const BatchTransactionModal: FC<BatchTransactionModalProps> = () => {
  const links = useLinks();
  const [state, send] = useBatchTransactionMachine();
  useKeyPressEvent("Escape", (ev) => {
    ev.preventDefault();
    send({ type: "cancel" });
  });

  const failedTaskName =
    state.matches("failed") &&
    state.context.writers.find((_, i) => i === state.context.i)?.name;

  return (
    <Dialog isOpen={state.value !== "idle"}>
      <DialogContent className="max-w-[520px] gap-5">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle
            className={textVariants({
              variant: "body-1-bold",
              className: "text-gray-800",
            })}
          >
            {state.context.header}
          </DialogTitle>
          {state.matches("failed") && (
            <DialogClose
              className="text-gray-900"
              onClick={() => send({ type: "cancel" })}
            >
              <X />
            </DialogClose>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {state.context.writers.map((writer, i) => {
            const status =
              state.context.i < i
                ? "idle"
                : (state.matches("write") || state.matches("wait")) &&
                    state.context.i === i
                  ? "pending"
                  : state.matches("failed") && state.context.i === i
                    ? "failed"
                    : "success";

            const hash = state.context.output[i]?.hash;
            return (
              <>
                <div key={writer.name}>
                  <div className="flex gap-2 items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        key={status}
                      >
                        {statusIcons[status]}
                      </motion.div>
                    </AnimatePresence>
                    <Span variant="body-2-medium">{writer.name}</Span>{" "}
                    <Spacer />
                    {hash && (
                      <a
                        target="_blank"
                        href={`${links.etherscan}/tx/${hash}`}
                        className="flex items-center gap-1 text-[12px] text-primary-500 rounded-[4px] bg-primary-50 px-2 py-1 cursor-pointer font-mono"
                      >
                        {shortenAddress(hash)}
                        <TbExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
                {i < state.context.writers.length - 1 && (
                  <div className="w-9 h-[18px] flex items-center justify-center">
                    <div className="w-[2px] h-full bg-gray-400"></div>
                  </div>
                )}
              </>
            );
          })}
          {/* <Collapse isOpened={state.matches("write")}>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <WalletIcon className="size-4" />
              <Text className="text-gray-500" variant="body-3-medium">
                Check your wallet for the transaction
              </Text>
            </div>
          </Collapse> */}
        </div>
        <DialogFooter className="block">
          <Collapse isOpened={state.matches("failed")}>
            <Button
              size="lg"
              className="w-full"
              variant="default"
              onClick={() => send({ type: "retry" })}
            >
              Retry {failedTaskName}
            </Button>
          </Collapse>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

BatchTransactionModal.displayName = "BatchTransactionModal";
