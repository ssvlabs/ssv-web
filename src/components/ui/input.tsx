import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils/tw";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftSlot, rightSlot, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex",
          "h-12",
          "w-full",
          "gap-2",
          "items-center",
          "rounded-lg",
          "px-5",
          "font-medium",
          "border",
          "border-gray-400",
          "bg-transparent",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          "invalid-within:border-error-500",
          "focus-within:border-primary-500",
          {
            "pr-1": rightSlot,
          },
          className,
        )}
      >
        <Slot>{leftSlot}</Slot>
        <input
          type={type}
          className="w-full h-full flex-1 bg-transparent outline-none"
          {...props}
          ref={ref}
        />
        <Slot>{rightSlot}</Slot>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
