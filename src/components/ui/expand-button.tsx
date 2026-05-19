import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/tw.ts";
import { IconButton } from "@/components/ui/button.tsx";

const ExpandButton = ({
  setIsOpen,
  isOpen,
  "data-testid": testId,
}: {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  "data-testid"?: string;
}) => {
  return (
    <IconButton
      data-testid={testId}
      variant="ghost"
      className="size-9 p-[2px] hover:bg-primary-100 hover:text-primary-500"
      onClick={(ev) => {
        ev.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <ChevronDown
        className={cn("size-4", {
          "transform rotate-180": isOpen,
        })}
      />
    </IconButton>
  );
};

export default ExpandButton;
