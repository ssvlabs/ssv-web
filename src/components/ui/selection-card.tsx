import React from "react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence, motion } from "framer-motion";

export interface SelectionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  isLoading?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  selected = false,
  isLoading = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      aria-selected={selected}
      className={cn(
        "flex-1 p-5 rounded-xl flex flex-col justify-center items-center cursor-pointer",
        "border border-primary-500 text-primary-500",
        "aria-selected:text-white aria-selected:bg-primary-500",
        "transition-colors duration-200 ease-in-out",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div className="mb-2 relative h-9 w-28">
        <AnimatePresence initial={false} mode="popLayout">
          {isLoading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Spinner
                size="lg"
                className={cn({
                  "text-white": selected,
                })}
              />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {icon}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Text variant="body-2-medium">{title}</Text>
      <Text
        variant="caption-medium"
        className={cn("text-gray-500", {
          "text-white": selected,
        })}
      >
        {description}
      </Text>
    </div>
  );
};

SelectionCard.displayName = "SelectionCard";
