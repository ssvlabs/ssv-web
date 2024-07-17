import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { cva, VariantProps } from "class-variance-authority";

export const variants = cva("", {
  variants: {
    size: {
      sm: "size-6 rounded-lg",
      md: "size-8 rounded-lg",
      lg: "h-12 rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type OperatorAvatarProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorAvatarProps> &
    OperatorAvatarProps &
    VariantProps<typeof variants>
>;

export const OperatorAvatar: FCProps = ({ className, size, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      <img
        className={cn(variants({ size }))}
        src="/images/operator_default_background/light.svg"
      />
    </div>
  );
};

OperatorAvatar.displayName = "OperatorAvatar";
