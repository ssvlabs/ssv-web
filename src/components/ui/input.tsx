import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils/tw";
import { cva } from "class-variance-authority";
import { Spinner } from "./spinner";
import { Button } from "@/components/ui/button.tsx";

export const inputVariants = cva(
  "flex h-12 w-full gap-2 items-center rounded-lg px-4 font-medium border border-gray-300 bg-transparent placeholder:text-gray-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 invalid-within:border-error-500 focus-within:border-primary-500",
);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  isLoading?: boolean;
  withDisableButton?: boolean;
  isSaveButtonDisabled?: boolean;
  saveButtonAction?: () => void;
  editButtonAction?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      isLoading,
      withDisableButton,
      isSaveButtonDisabled,
      saveButtonAction,
      editButtonAction,
      leftSlot,
      rightSlot,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const [selfDisable, setSelfDisable] = React.useState(withDisableButton);
    return (
      <div
        className={cn(
          inputVariants(),
          {
            "pr-4": rightSlot,
          },
          `${props.disabled || selfDisable ? "bg-gray-200" : "bg-transparent"}`,
          className,
        )}
      >
        <Slot>{isLoading ? <Spinner /> : leftSlot}</Slot>
        {withDisableButton && selfDisable && !props.value && (
          <div
            onClick={() => setSelfDisable(!selfDisable)}
            className="ml-[50%] text-primary-500 text-[14px] cursor-pointer"
          >
            Add Data
          </div>
        )}
        <input
          disabled={props.disabled || selfDisable}
          type={type}
          {...props}
          {...inputProps}
          className={cn(
            `w-full h-full flex-1 bg-transparent outline-none ${props.disabled ? "text-gray-500" : "text-gray-800"}`,
            inputProps?.className,
          )}
          ref={ref}
        />
        {withDisableButton && !selfDisable && (
          <Button
            disabled={isSaveButtonDisabled}
            onClick={() => {
              setSelfDisable(true);
              saveButtonAction && saveButtonAction();
            }}
            className="h-8"
          >
            Save
          </Button>
        )}
        {withDisableButton && selfDisable && props.value && (
          <div
            onClick={() => {
              setSelfDisable(!selfDisable);
              editButtonAction && editButtonAction();
            }}
            className="ml-[50%] text-primary-500 text-[14px] cursor-pointer"
          >
            Edit Data
          </div>
        )}
        <Slot>{rightSlot}</Slot>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
