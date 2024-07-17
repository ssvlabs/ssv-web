import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type BalanceWarningProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof BalanceWarningProps> &
    BalanceWarningProps
>;

export const BalanceWarning: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      BalanceWarning
    </div>
  );
};

BalanceWarning.displayName = "BalanceWarning";
