import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Outlet } from "react-router-dom";

export const MainContainer: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn(className, "max-w-screen-xl mx-auto h-full")} {...props}>
      <Outlet />
    </div>
  );
};

MainContainer.displayName = "MainContainer";
