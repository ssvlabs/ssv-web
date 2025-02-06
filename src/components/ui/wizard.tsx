import type { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Text } from "@/components/ui/text.tsx";

export const Wizard = ({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: string | ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gray-200">
      <div className="w-full h-20 bg-gray-50 pl-[180px] flex items-center">
        <Text variant="body-1-bold">{title}</Text>
      </div>
      <div className="flex-1 w-full overflow-auto">{children}</div>
      <div className="w-full h-20 bg-gray-50 pl-[180px] flex items-center">
        <div className="w-[160px] h-48px">
          <Button onClick={onClose} className="size-full" variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
