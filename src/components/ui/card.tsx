import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { cva, type VariantProps } from "class-variance-authority";

const variants = cva("bg-[#FDFEFE] dark:bg-[#0B2A3C] rounded-2xl", {
  variants: {
    variant: {
      default: "p-8 flex flex-col gap-6",
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends VariantProps<typeof variants> {}

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof CardProps> & CardProps
>;

export const Card: FCProps = ({ className, variant, children, ...props }) => {
  return (
    <div className={cn(variants({ variant, className }))} {...props}>
      {children}
    </div>
  );
};

Card.displayName = "Card";
