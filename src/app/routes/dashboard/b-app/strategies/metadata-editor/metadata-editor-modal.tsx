import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { useMetadataEditorModal } from "@/signals/modal";

export type MetadataEditorModalProps = {
  // TODO: Add props or remove this type
};

export const MetadataEditorModal: FC<MetadataEditorModalProps> = () => {
  const modal = useMetadataEditorModal();

  return (
    <Dialog {...modal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => modal.close()}>
            Close
          </Button>
          <Button>Secondary Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

MetadataEditorModal.displayName = "MetadataEditorModal";
