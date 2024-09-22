import { cn } from "@/lib/utils/tw";
import type { ComponentWithAs } from "@/types/component";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

const variants = cva("", {
  variants: {
    variant: {
      title: "text-[40px] font-extrabold",
      headline1: "text-[32px] font-extrabold",
      headline2: "text-[28px] font-extrabold",
      headline3: "text-2xl font-extrabold",
      headline4: "text-xl font-bold",
      "body-1-bold": "text-lg font-bold",
      "body-1-semibold": "text-lg font-semibold",
      "body-1-medium": "text-lg font-medium",
      "body-2-bold": "text-base font-bold",
      "body-2-semibold": "text-base font-semibold",
      "body-2-medium": "text-base font-medium",
      "body-3-bold": "text-sm font-bold",
      "body-3-semibold": "text-sm font-semibold",
      "body-3-medium": "text-sm font-medium",
      "caption-bold": "text-xs font-bold",
      "caption-semibold": "text-xs font-semibold",
      "caption-medium": "text-xs font-medium",
      overline: "text-[10px]",
    },
  },
  defaultVariants: {},
});

export type TextProps = ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof variants>;

type FCProps = ComponentWithAs<"p", TextProps>;

// @ts-expect-error fix this
export const Text: FCProps = forwardRef(
  ({ className, variant, children, as, ...props }, ref) => {
    const Component = as ?? "p";
    return (
      <Component
        ref={ref}
        className={cn(variants({ variant, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

// @ts-expect-error fix this
export const Span: FCProps = forwardRef(
  ({ className, variant, children, as, ...props }, ref) => {
    const Component = as ?? "span";
    return (
      <Component
        ref={ref}
        className={cn(variants({ variant, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
Span.displayName = "Span";
