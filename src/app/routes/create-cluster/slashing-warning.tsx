import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type SlashingWarningProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SlashingWarningProps> &
    SlashingWarningProps
>;

export const SlashingWarning: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      SlashingWarning
    </div>
  );
};

SlashingWarning.displayName = "SlashingWarning";
