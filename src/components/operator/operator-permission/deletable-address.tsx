import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, FC } from "react";

export type DeletableAddressProps = {
  address: string;
  onDelete: (address: string) => void;
  onUndo: (address: string) => void;
  isMarked?: boolean;
  disabled?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof DeletableAddressProps> &
    DeletableAddressProps
>;

export const DeletableAddress: FCProps = ({
  className,
  address,
  onDelete,
  onUndo,
  isMarked,
  disabled,
  ...props
}) => {
  return (
    <div
      className={cn(
        className,
        "flex items-center justify-between gap-4 p-1 pl-5 h-12 rounded-lg border border-gray-300",
        {
          "pointer-events-none": disabled,
          "bg-gray-200": isMarked,
          "bg-gray-100": disabled,
          "text-gray-500": disabled,
        },
      )}
      {...props}
    >
      <div className="flex gap-1">
        <p
          className={cn({
            "line-through": isMarked,
            "text-error-200": isMarked,
          })}
        >
          {address}
        </p>
        {isMarked && <span className="text-gray-500">(remove)</span>}
      </div>
      {!disabled &&
        (isMarked ? (
          <Button
            variant="ghost"
            className="text-primary-500"
            onClick={() => onUndo(address)}
          >
            Undo
          </Button>
        ) : (
          <Button size="icon" variant="ghost" onClick={() => onDelete(address)}>
            <X className="size-5" />
          </Button>
        ))}
    </div>
  );
};

DeletableAddress.displayName = "DeletableAddress";
