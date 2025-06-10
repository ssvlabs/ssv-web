import type { FC, ComponentPropsWithoutRef } from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useManageObligationsModal } from "@/signals/modal.ts";
import type { Address } from "abitype";

export type EditStrategyMenuProps = {
  strategyId: string;
  bAppId: Address;
  obligations: Record<
    Address,
    {
      bAppId: Address;
      percentage: string;
      percentageProposed: string;
      percentageProposedTimestamp: string;
    }
  >;
};

type ManageObligationsBtnFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof EditStrategyMenuProps> &
    EditStrategyMenuProps &
    ButtonProps
>;

export const ManageObligationsBtn: ManageObligationsBtnFC = ({
  className,
  bAppId,
  strategyId,
  ...props
}) => {
  const manageObligationsModal = useManageObligationsModal();

  return (
    <Button
      onClick={() => {
        manageObligationsModal.open({
          strategyId,
          bAppId,
        });
      }}
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      Manage Obligations
    </Button>
  );
};

ManageObligationsBtn.displayName = "ManageObligationsBtn";
