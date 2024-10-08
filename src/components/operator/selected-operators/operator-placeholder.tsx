import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export type OperatorPlaceholderProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorPlaceholderProps> &
    OperatorPlaceholderProps
>;

export const OperatorPlaceholder: FCProps = ({ className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      OperatorPlaceholder
    </div>
  );
};

OperatorPlaceholder.displayName = "OperatorPlaceholder";
