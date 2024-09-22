import { cn } from "@/lib/utils/tw";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { MdOutlineLock } from "react-icons/md";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

export const variants = cva("object-cover", {
  variants: {
    variant: {
      circle: "rounded-full",
      square: "rounded-lg",
    },

    size: {
      sm: "size-6",
      md: "size-8",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "square",
  },
});

export type OperatorAvatarProps = {
  src?: string;
  isPrivate?: boolean;
};

type FCProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof OperatorAvatarProps
> &
  OperatorAvatarProps &
  VariantProps<typeof variants>;

export const OperatorAvatar = forwardRef<HTMLDivElement, FCProps>(
  ({ src, className, isPrivate, size, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variants({ size, variant, className }),
          "relative select-none aspect-square",
        )}
        {...props}
      >
        {isPrivate && (
          <div className="absolute flex items-center justify-center left-0 top-0 -m-2 bg-gray-50 text-gray-800 rounded-full size-7 border">
            <MdOutlineLock className="size-4" />
          </div>
        )}
        <img
          className={cn(variants({ size, variant }), "w-full h-full")}
          src={src || "/images/operator_default_background/light.svg"}
        />
      </div>
    );
  },
);

OperatorAvatar.displayName = "OperatorAvatar";
