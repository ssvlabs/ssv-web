import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";

export const SsvLoader: FC<ComponentPropsWithoutRef<"img">> = ({
  className,
  ...props
}) => {
  return (
    <img className={cn(className)} {...props} src={`/images/ssv-loader.svg`} />
  );
};

SsvLoader.displayName = "SsvLoader";
