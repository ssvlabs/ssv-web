import type { FC, ComponentPropsWithoutRef } from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  useManageObligationsModal,
  useObligateModal,
} from "@/signals/modal.ts";
import type { Address } from "abitype";

export type ObligateBtnProps = {
  token: Address;
  strategyId: string;
  obligationUpdateData: {
    isObligated: boolean;
    isPending: boolean;
    isPendingEnd: number;
    isExpired: boolean;
    isWaiting: boolean;
    isFinalizeEnd: number;
  };
};

type ObligateBtnFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ObligateBtnProps> &
    ObligateBtnProps &
    ButtonProps
>;

export const ObligateBtn: ObligateBtnFC = ({
  className,
  strategyId,
  token,
  obligationUpdateData,
  ...props
}) => {
  const modal = useManageObligationsModal();

  const obligationsModal = useObligateModal();
  const { isObligated, isWaiting } = obligationUpdateData;
  return (
    <Button
      onClick={() => {
        obligationsModal.open({
          strategyId,
          token,
          bAppId: modal.meta.bAppId || "0x",
          obligationUpdateData,
        });
      }}
      variant={isObligated ? "secondary" : "default"}
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      {isWaiting ? "Execute" : isObligated ? "Edit" : "Add"}
    </Button>
  );
};

ObligateBtn.displayName = "ObligateBtn";
