import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import type { FC } from "react";

type UnsavedChangesModalProps = {
  isOpen: boolean;
  onDiscard?: () => void;
  onCancel?: () => void;
};

export const UnsavedChangesModal: FC<UnsavedChangesModalProps> = ({
  isOpen,
  onDiscard,
  onCancel,
}) => {
  return (
    <Dialog isOpen={isOpen}>
      <DialogContent className="flex bg-gray-50 flex-col gap-3 max-w-[424px] font-medium ">
        <Text variant="headline4">Unsaved Changes</Text>

        <Text>
          Are you sure that you want to discard changes? Any unsaved changes
          will be lost.
        </Text>
        <div className="flex [&>*]:flex-1 gap-2 mt-4">
          <Button onClick={onDiscard} size="lg">
            Discard
          </Button>
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

UnsavedChangesModal.displayName = "UnsavedChangesModal";
