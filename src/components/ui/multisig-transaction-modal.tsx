import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useAccountState } from "@/hooks/account/use-account-state";
import { useMultisigTransactionModal } from "@/signals/modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, FC } from "react";

export type MultisigTransactionModalProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MultisigTransactionModalProps> &
    MultisigTransactionModalProps
>;

export const MultisigTransactionModal: FCProps = () => {
  const { isOpen, close } = useMultisigTransactionModal();
  const { accountRoutePath } = useAccountState();
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
        <Button
          as={Link}
          to={accountRoutePath}
          className="w-full"
          size="xl"
          variant="secondary"
          onClick={() => close()}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

MultisigTransactionModal.displayName = "MultisigTransactionModal";
