import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils/tw";
import { cva } from "class-variance-authority";
import { Spinner } from "./spinner";

export const inputVariants = cva(
  "flex h-12 w-full gap-2 items-center rounded-lg px-5 font-medium border border-gray-300 bg-transparent placeholder:text-gray-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 invalid-within:border-error-500 focus-within:border-primary-500",
);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  isLoading?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, isLoading, leftSlot, rightSlot, inputProps, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          inputVariants(),
          {
            "pr-4": rightSlot,
          },
          className,
        )}
      >
        <Slot>{isLoading ? <Spinner /> : leftSlot}</Slot>
        <input
          type={type}
          {...props}
          {...inputProps}
          className={cn(
            inputProps?.className,
            "w-full h-full flex-1 bg-transparent outline-none",
          )}
          ref={ref}
        />
        <Slot>{rightSlot}</Slot>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
