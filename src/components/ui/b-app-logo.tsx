import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

const bappLogoVariants = cva("", {
  variants: {
    variant: {
      outlined: "rounded-[8px] size-7 border-gray-400 border",
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "outlined",
  },
});

type BAppLogoProps = ComponentPropsWithRef<"img"> &
  VariantProps<typeof bappLogoVariants>;

export const BAppLogo = ({ src, className, variant }: BAppLogoProps) => {
  return (
    <img
      src={src || "/images/operator_default_background/light.svg"}
      onError={(e) => {
        e.currentTarget.src = "/images/operator_default_background/light.svg";
      }}
      alt="BApp Logo"
      className={bappLogoVariants({ variant, className })}
    />
  );
};
