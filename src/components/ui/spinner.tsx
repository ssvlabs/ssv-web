import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { cva, type VariantProps } from "class-variance-authority";
import type { Loader2 } from "lucide-react";
import { CgSpinner } from "react-icons/cg";

export const spinnerVariants = cva("text-primary-500 animate-spin", {
  variants: {
    size: {
      default: "w-6 h-6",
      sm: "w-4 h-4",
      lg: "w-8 h-8",
    },
  },

  defaultVariants: {
    size: "default",
  },
});

export const Spinner: FC<
  ComponentPropsWithoutRef<typeof Loader2> &
    VariantProps<typeof spinnerVariants>
> = ({ className, size, ...props }) => {
  return (
    <CgSpinner
      className={cn(
        spinnerVariants({
          className,
          size,
        }),
      )}
      {...props}
    />
  );
};

Spinner.displayName = "Spinner";
