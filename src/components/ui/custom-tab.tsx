import * as React from "react";

import type { ComponentWithAs } from "@/types/component";
import { Badge } from "./badge";
import { Button, type ButtonProps } from "./button";
import { textVariants } from "./text";
import { cn } from "@/lib/utils/tw";

type TabProps = {
  count?: number;
};

type TabFC = ComponentWithAs<"button", ButtonProps & TabProps>;

// @ts-expect-error - polymorphic component typing
export const Tab: TabFC = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & TabProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "group w-fit text-sm",
        "data-[active=true]:bg-primary-50 data-[active=true]:font-semibold data-[active=true]:text-gray-800 data-[active=true]:hover:bg-primary-50 data-[active=true]:active:bg-primary-100",
        "data-[active=false]:bg-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:bg-gray-200 data-[active=false]:active:bg-gray-300",
        className,
      )}
      {...props}
    >
      {props.children}
      {props.count !== undefined && (
        <Badge
          variant="unstyled"
          size="sm"
          className={textVariants({
            variant: "caption-semibold",
            className: cn(
              "rounded-sm px-1 py-[2px]",
              "group-data-[active=true]:bg-primary-500 group-data-[active=true]:text-gray-50",
              "group-data-[active=false]:bg-primary-50 group-data-[active=false]:text-primary-400",
            ),
          })}
        >
          {" "}
          {props.count}
        </Badge>
      )}
    </Button>
  );
});

Tab.displayName = "Tab";
