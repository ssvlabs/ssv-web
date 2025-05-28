import type { FC, ComponentPropsWithoutRef } from "react";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useOptInModal } from "@/signals/modal";
import { useParams } from "react-router";
import { GoPlus } from "react-icons/go";

export type EditStrategyMenuProps = {
  strategyId?: string;
};

type EditStrategyMenuFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof EditStrategyMenuProps> &
    EditStrategyMenuProps &
    ButtonProps
>;

export const OptInBtn: EditStrategyMenuFC = ({
  className,
  strategyId,
  variant,
  ...props
}) => {
  const optInModal = useOptInModal();
  const id = useParams().strategyId || strategyId;
  return (
    <Button
      onClick={() => {
        optInModal.open({
          strategyId: id || "",
        });
      }}
      variant={variant || "secondary"}
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      <GoPlus className="size-5" />
      Opt-in to bApp
    </Button>
  );
};

OptInBtn.displayName = "OptInBtn";
