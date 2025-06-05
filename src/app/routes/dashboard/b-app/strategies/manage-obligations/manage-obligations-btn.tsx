import type { FC, ComponentPropsWithoutRef } from "react";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useManageObligationsModal } from "@/signals/modal.ts";
import type { Address } from "abitype";
// import { useOptInModal } from "@/signals/modal";
// import { useParams } from "react-router";
// import { GoPlus } from "react-icons/go";

export type EditStrategyMenuProps = {
  strategyId: string;
  bAppId: Address;
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
  // variant,
  ...props
}) => {
  const manageObligationsModal = useManageObligationsModal();
  // const id = useParams().strategyId || strategyId;

  return (
    <Button
      onClick={() => {
        manageObligationsModal.open({
          strategyId,
          bAppId,
        });
      }}
      // variant={variant || "secondary"}
      className={`flex items-center gap-1 ${className}`}
      {...props}
    >
      Manage Obligations
    </Button>
  );
};

ManageObligationsBtn.displayName = "ManageObligationsBtn";

// const ManageObligationsBtn = () => {
//   return <div></div>;
// };
//
// export default ManageObligationsBtn;
