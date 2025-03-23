import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { useTheme } from "@/hooks/app/use-theme";

export const SsvLogo: FC<ComponentPropsWithoutRef<"img">> = ({
  className,
  ...props
}) => {
  const theme = useTheme();
  return (
    <img
      className={cn("h-7", className)}
      {...props}
      src={`/images/logo/${theme.dark ? "light" : "dark"}.svg`}
    />
  );
};

SsvLogo.displayName = "SsvLogo";
