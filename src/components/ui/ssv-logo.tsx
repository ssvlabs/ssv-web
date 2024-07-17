import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const SsvLogo: FC<ComponentPropsWithoutRef<"img">> = ({
  className,
  ...props
}) => {
  return (
    <img
      className={cn(className, "h-7")}
      {...props}
      src="https://app.stage.ssv.network/images/logo/dark.svg"
    />
  );
};

SsvLogo.displayName = "SsvLogo";
