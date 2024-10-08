import { cn } from "@/lib/utils/tw";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

export const Loading: React.FC<ComponentPropsWithoutRef<"div">> = ({
  className,
}) => (
  <motion.div
    className={cn(
      "flex flex-col items-center justify-center gap-6 h-full w-full p-12",
      className,
    )}
    initial={{ opacity: 0, scale: 0.9, y: -20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
  >
    <img src="/images/ssv-loader.svg" className="size-20" />
  </motion.div>
);
