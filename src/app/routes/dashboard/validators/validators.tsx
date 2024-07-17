import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const Validators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      ValidatorsRoute
    </div>
  );
};

Validators.displayName = "Validators";
