import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/tw";
import type { ComponentWithAs, PropsWithAs } from "@/types/component";
import { CgSpinner } from "react-icons/cg";
import { Spinner } from "@/components/ui/spinner";

export const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 ",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border dark:border-white/10 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-primary-50 text-primary-500 hover:bg-primary-100 active:bg-primary-200",
        ghost: "hover:bg-gray-300 ",
        success:
          "bg-success-100 text-success-500  hover:bg-success-300 active:bg-success-500",
        subtle:
          "bg-slate-400/5 hover:bg-slate-400/20 hover:text-accent-foreground ",
        link: "inline-flex text-primary-500 underline-offset-4 hover:underline",
        disabled: "cursor-not-allowed opacity-50 bg-gray-300 text-gray-500",
      },
      colorScheme: {
        wallet:
          "bg-[#F9FBFC] hover:bg-[#F2F6FA] text-gray-900 dark:bg-[#062031] dark:hover:bg-[#011627]",
        error: "",
      },
      size: {
        default: "h-10 px-4 py-2 font-semibold text-md rounded-lg",
        sm: "h-9 px-3 font-semibold text-sm rounded-lg",
        lg: "h-12 px-6 font-semibold text-md rounded-lg",
        xl: "h-[60px] px-6 font-semibold text-md rounded-lg",
        icon: "size-7 rounded-lg",
        network: "h-12 pl-3 pr-4 font-semibold text-md rounded-lg",
        wallet: "h-12 px-4 font-semibold text-md rounded-lg",
        none: "",
      },
      width: {
        full: "w-full",
        default: "",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        class: "p-0 h-auto inline",
      },
      {
        variant: "outline",
        colorScheme: "error",
        class:
          "bg-error-100 text-error-500 hover:text-error-200 hover:bg-error-300 active:bg-error-500 border-error-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  },
);

export interface ButtonProps
  extends PropsWithAs<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isActionBtn?: boolean;
  icon?: React.ReactNode;
}

export type ButtonFC = ComponentWithAs<"button", ButtonProps>;

// @ts-expect-error - I don't know how to fix this
export const Button: ButtonFC = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      colorScheme,
      width,
      icon,
      isLoading,
      loadingText,
      children,
      isActionBtn,
      disabled,
      type = "button",
      as,
      ...props
    },
    ref,
  ) => {
    const Comp = as ?? "button";
    const _loadingText = loadingText ?? "Waiting for Wallet Confirmation...";
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: disabled ? "disabled" : variant,
            size,
            colorScheme,
            className,
            width,
          }),
          {
            "opacity-50": isLoading,
          },
        )}
        aria-disabled={disabled}
        disabled={disabled}
        type={type}
        ref={ref}
        {...props}
        onClick={
          disabled || isLoading
            ? (ev: React.MouseEvent<HTMLButtonElement>) => ev.preventDefault()
            : props.onClick
        }
      >
        <>
          {isLoading ? <CgSpinner className="animate-spin size-6" /> : icon}
          {isLoading ? (isActionBtn ? _loadingText : children) : children}
        </>
      </Comp>
    );
  },
);

Button.displayName = "Button";

// @ts-expect-error - I don't know how to fix this
export const IconButton: ButtonFC = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      colorScheme,
      width,
      isLoading,
      children,
      disabled,
      type = "button",
      as,
      ...props
    },
    ref,
  ) => {
    const Comp = as ?? "button";

    const copiedChildren = React.useMemo(() => {
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          // @ts-expect-error className is not a valid prop
          className: cn(children.props.className, className, "size-[65%]"),
        });
      }
    }, [children, className, props]);

    return (
      <Comp
        className={cn(
          "size-7",
          buttonVariants({
            variant: disabled ? "disabled" : variant ?? "subtle",
            colorScheme,
            className,
            size: "icon",
            width,
          }),

          {
            "opacity-50": isLoading,
          },
        )}
        aria-disabled={disabled}
        disabled={disabled}
        type={type}
        ref={ref}
        {...props}
        onClick={
          disabled || isLoading
            ? (ev: React.MouseEvent<HTMLButtonElement>) => ev.preventDefault()
            : props.onClick
        }
      >
        {isLoading ? <Spinner className="size-[65%]" /> : copiedChildren}
      </Comp>
    );
  },
);
