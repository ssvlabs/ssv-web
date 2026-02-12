import { cn } from "@/lib/utils/tw";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, FC, ReactElement } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
    VariantProps<typeof variants> & {
      backButtonLabel?: string | ReactElement;
      navigateRoutePath?: string;
      onBackButtonClick?: () => void;
      wrapperClassName?: ComponentPropsWithoutRef<"div">["className"];
    }
>;

export const Container: FCProps = ({
  className,
  size,
  variant,
  onBackButtonClick,
  backButtonLabel,
  navigateRoutePath,
  wrapperClassName,
  ...props
}) => {
  const navigate = useNavigate();
  return (
    <div className={cn("px-5", wrapperClassName)}>
      {backButtonLabel && (
        <div
          onClick={() => {
            onBackButtonClick && onBackButtonClick();
            navigateRoutePath ? navigate(navigateRoutePath) : navigate(-1);
          }}
          className="w-full h-[60px] bg-gray-100 px-[300px] py-3.5"
        >
          <div className="flex items-center gap-3 cursor-pointer text-lg font-bold">
            <FaArrowLeft className="size-[24px] text-primary-500" />
            {backButtonLabel}
          </div>
        </div>
      )}
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
    </div>
  );
};

Container.displayName = "Container";
