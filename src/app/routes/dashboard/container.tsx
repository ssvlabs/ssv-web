import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export const MainContainer: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(className, "max-w-screen-xl mx-auto h-full p-6")}
      {...props}
    />
  );
};

MainContainer.displayName = "MainContainer";
