import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { usePastingLimitExceededModal } from "@/signals/modal";
import { X } from "lucide-react";
import type { FC } from "react";

export const PastingLimitExceededModal: FC = () => {
  const { isOpen, close } = usePastingLimitExceededModal();

  return (
    <Dialog isOpen={isOpen}>
      <DialogContent className="flex bg-gray-50 flex-col gap-3 max-w-[424px] font-medium ">
        <div className="flex justify-between">
          <Text variant="headline4">Limit Exceeded</Text>
          <Button size="icon" variant="ghost" onClick={() => close()}>
            <X />
          </Button>
        </div>

        <Text>
          It appears that you tried to paste more than 500 addresses at once.
        </Text>
        <Text>Please select up to 500 addresses and try again.</Text>
        <Button
          variant="outline"
          colorScheme="error"
          className="mt-4"
          size="xl"
          onClick={() => close()}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

PastingLimitExceededModal.displayName = "PastingLimitExceededModal";
