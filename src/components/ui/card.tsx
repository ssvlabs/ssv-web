import { cn } from "@/lib/utils/tw";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentWithAs } from "@/types/component";
import type { ReactNode } from "react";
import { Text, textVariants } from "@/components/ui/text";
import { isString } from "lodash-es";
import { Slot } from "@radix-ui/react-slot";

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

type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
};

type CardHeaderFC = ComponentWithAs<"div", CardHeaderProps>;
export const CardHeader: CardHeaderFC = ({
  as,
  title,
  description,
  className,
  ...props
}) => {
  const Comp = as ?? "div";
  const isTitleString = isString(title);
  const isDescriptionString = isString(description);

  return (
    <Comp className={cn("flex flex-col gap-4", className)} {...props}>
      {isTitleString ? (
        <Text variant="headline4">{title}</Text>
      ) : (
        <Slot className={textVariants({ variant: "headline4" })}>{title}</Slot>
      )}

      {description &&
        (isDescriptionString ? (
          <Text variant="body-2-medium">{description}</Text>
        ) : (
          <Slot className={textVariants({ variant: "body-2-medium" })}>
            {description}
          </Slot>
        ))}
    </Comp>
  );
};
