import { cn } from "@/lib/utils/tw";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentWithAs } from "@/types/component";

const variants = cva("bg-gray-50 rounded-2xl mx-auto", {
  variants: {
    variant: {
      default: "p-8 flex flex-col gap-6",
      disabled: "opacity-80",
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends VariantProps<typeof variants> {}

type FCProps = ComponentWithAs<"div", CardProps>;

export const Card: FCProps = ({
  className,
  as,
  variant,
  children,
  ...props
}) => {
  const Comp = as ?? "div";
  return (
    <Comp
      tabIndex={-1}
      className={cn(variants({ variant, className }), "outline-none")}
      {...props}
    >
      {children}
    </Comp>
  );
};

Card.displayName = "Card";
