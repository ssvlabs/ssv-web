import { cn } from "@/lib/utils/tw";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, FC } from "react";

export const variants = cva("mx-auto max-w-full", {
  variants: {
    variant: {
      vertical: "flex flex-col gap-6 items-start",
      horizontal: "flex gap-6",
    },
    size: {
      default: "w-[648px]",
      lg: "w-[872px]",
      xl: "w-[1320px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof VariantProps<typeof variants>> &
    VariantProps<typeof variants>
>;

export const Container: FCProps = ({ className, size, variant, ...props }) => {
  return (
    <div
      className={cn(
        variants({
          className,
          size,
          variant,
        }),
      )}
      {...props}
    />
  );
};

Container.displayName = "Container";
