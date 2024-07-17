import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const Spacer: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return <div className={cn(className, "flex-1")} {...props} />;
};

Spacer.displayName = "Spacer";
