import { cn } from "@/lib/utils/tw";
import type { ComponentWithAs } from "@/types/component";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

export const textVariants = cva("", {
  variants: {
    variant: {
      title: "text-[40px] font-extrabold text-gray-800",
      headline1: "text-[32px] font-extrabold text-gray-800",
      headline2: "text-[28px] font-extrabold text-gray-800",
      headline3: "text-2xl font-extrabold text-gray-800",
      headline4: "text-xl font-bold text-gray-800",
      "body-1-bold": "text-lg font-bold text-gray-700",
      "body-1-semibold": "text-lg font-semibold text-gray-700",
      "body-1-medium": "text-lg font-medium text-gray-700",
      "body-2-bold": "text-base font-bold text-gray-700",
      "body-2-semibold": "text-base font-semibold text-gray-700",
      "body-2-medium": "text-base font-medium text-gray-700",
      "body-3-bold": "text-sm font-bold text-gray-700",
      "body-3-semibold": "text-sm font-semibold text-gray-700",
      "body-3-medium": "text-sm font-medium text-gray-700",
      "caption-bold": "text-xs font-bold text-gray-700",
      "caption-semibold": "text-xs font-semibold text-gray-700",
      "caption-medium": "text-xs font-medium text-gray-700",
      overline: "text-[10px] text-gray-700",
    },
  },

  defaultVariants: {},
});

export type TextProps = ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof textVariants>;

type FCProps = ComponentWithAs<"p", TextProps>;

// @ts-expect-error fix this
export const Text: FCProps = forwardRef(
  ({ className, variant, children, as, ...props }, ref) => {
    const Component = as ?? "p";
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, className }))}
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
        className={cn(textVariants({ variant, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
Span.displayName = "Span";
