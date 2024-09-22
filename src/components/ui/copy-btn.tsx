import type { ButtonProps } from "@/components/ui/button";
import { IconButton } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils/tw";
import { AnimatePresence, motion } from "framer-motion";
import type { FC } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

export type CopyBtnProps = {
  text: string | undefined;
};

type FCProps = FC<Omit<ButtonProps, keyof CopyBtnProps> & CopyBtnProps>;

export const CopyBtn: FCProps = ({ className, text, ...props }) => {
  const { copy, hasCopied } = useClipboard();
  return (
    <IconButton
      disabled={!text}
      variant="subtle"
      className={cn("relative inline-flex overflow-hidden size-6", className)}
      {...props}
      onClick={(ev) => {
        ev.stopPropagation();
        props.onClick?.(ev);
        return copy(text ?? "");
      }}
    >
      <AnimatePresence>
        {!hasCopied ? (
          <motion.div
            key="copy"
            className="size-[55%]"
            style={{
              color: "inherit",
              position: "absolute",
              top: "50%",
              left: "50%",
              translate: "-50%, -50%",
            }}
            transition={{ duration: 0.2, type: "spring" }}
            initial={{ opacity: 0, rotate: -180, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, rotate: 0, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, rotate: 180, x: "-50%", y: "-50%" }}
          >
            <LuCopy className="size-full text-inherit" strokeWidth="2.5" />
          </motion.div>
        ) : (
          <motion.div
            key="copied"
            className="size-[55%]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
            transition={{ duration: 0.2, type: "spring" }}
            initial={{ opacity: 0, rotate: -180, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, rotate: 0, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, rotate: 180, x: "-50%", y: "-50%" }}
          >
            <LuCheck className="text-success-500 size-full" strokeWidth="2.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
};

CopyBtn.displayName = "CopyBtn";
