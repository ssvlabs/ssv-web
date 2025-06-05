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
  isObligated: boolean;
};

type ObligateBtnFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ObligateBtnProps> &
    ObligateBtnProps &
    ButtonProps
>;

export const ObligateBtn: ObligateBtnFC = ({
  className,
  isObligated,
  token,
  ...props
}) => {
  const modal = useManageObligationsModal();

  const obligationsModal = useObligateModal();

  return (
    <Button
      onClick={() => {
        obligationsModal.open({
          token,
          bAppId: modal.meta.bAppId || "0x",
        });
      }}
      variant={isObligated ? "secondary" : "default"}
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      {isObligated ? "Edit" : "Obligate"}
    </Button>
  );
};

ObligateBtn.displayName = "ObligateBtn";
