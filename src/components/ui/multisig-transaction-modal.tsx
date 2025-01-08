import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useAccountState } from "@/hooks/account/use-account-state";
import { useMultisigTransactionModal } from "@/signals/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useLocation } from "react-router";

export type MultisigTransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MultisigTransactionModalProps> &
    MultisigTransactionModalProps
>;
const mandatoryBtnProps = {
  className: "w-full",
  size: "xl",
  variant: "secondary",
};
export const MultisigTransactionModal: FCProps = () => {
  const { isOpen, close } = useMultisigTransactionModal();
  const { accountRoutePath } = useAccountState();
  const location = useLocation();
  const buttonProps = location.pathname.includes("reshare")
    ? { ...mandatoryBtnProps, onClick: () => close() }
    : {
        ...mandatoryBtnProps,
        as: Link,
        to: accountRoutePath,
        onClick: () => close(),
      };
  return (
    <Dialog isOpen={isOpen}>
      <DialogContent className="flex bg-gray-50 flex-col gap-8 max-w-[424px] font-medium ">
        <div className="flex flex-col gap-3">
          <DialogTitle>
            <Text variant="headline4">Transaction Initiated</Text>
          </DialogTitle>
          <Text variant="body-2-medium">
            Your transaction has been successfully initiated within the
            multi-sig wallet and is now pending approval from other
            participants.
          </Text>
          <Text variant="body-2-medium">
            Please return to this web app once approved.
          </Text>
        </div>
        <img src="/images/ssv-loader.svg" className="size-28 mx-auto" />
        <Button {...(buttonProps as ButtonProps)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

MultisigTransactionModal.displayName = "MultisigTransactionModal";
