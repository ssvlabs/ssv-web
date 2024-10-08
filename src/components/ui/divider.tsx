import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof DividerProps> & DividerProps
>;

export const Divider: FCProps = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <div
      className={cn(
        {
          "border-t border-gray-300": orientation === "horizontal",
          "border-l border-gray-300": orientation === "vertical",
        },
        className,
      )}
      {...props}
    />
  );
};

Divider.displayName = "Divider";
