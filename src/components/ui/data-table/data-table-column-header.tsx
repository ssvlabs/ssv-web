"use client";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { type Column } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("whitespace-nowrap", className)}>
        <Text variant="caption-medium" className="text-gray-500">
          {title}
        </Text>
      </div>
    );
  }

  const sort = column.getIsSorted();

  return (
    <div
      onClick={() => column.toggleSorting()}
      className={cn(
        "flex h-full cursor-pointer select-none items-center gap-[6px] whitespace-nowrap ",
        className,
      )}
    >
      <Text
        variant="caption-medium"
        className={cn("text-gray-500", {
          "text-gray-800": Boolean(sort),
        })}
      >
        {title}
      </Text>
      <div className="relative size-3">
        <FaSort
          className={cn("absolute inset-0 size-3", {
            "text-gray-300": Boolean(sort),
          })}
        />
        {sort === "asc" && (
          <FaSortUp className="absolute inset-0 size-3 text-primary-500" />
        )}
        {sort === "desc" && (
          <FaSortDown className="absolute inset-0 size-3 text-primary-500" />
        )}
      </div>
    </div>
  );
}
