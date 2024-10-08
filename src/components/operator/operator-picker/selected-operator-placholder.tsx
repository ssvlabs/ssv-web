import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";

export type SelectedOperatorPlaceholderProps = {
  number: number;
};

type SelectedOperatorPlaceholderFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof SelectedOperatorPlaceholderProps
  > &
    SelectedOperatorPlaceholderProps
>;

export const SelectedOperatorPlaceholder: SelectedOperatorPlaceholderFC = ({
  number,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "px-5 mr-2 py-4 min-h-[80px] flex items-center  rounded-lg bg-gray-200 border border-gray-400 border-dashed ",
        className,
      )}
      {...props}
    >
      <Text variant="body-2-medium" className="text-gray-400">
        Select operator {number}
      </Text>
    </div>
  );
};

SelectedOperatorPlaceholder.displayName = "SelectedOperatorPlaceholder";
