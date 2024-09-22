import { cn } from "@/lib/utils/tw";
import type { ComponentWithAs, PropsWithAs } from "@/types/component";
import React from "react";

export type TableProps = React.HTMLAttributes<HTMLDivElement> & {
  gridTemplateColumns: string;
};

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, gridTemplateColumns, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col border border-gray-300 bg-gray-50 rounded-xl overflow-auto",
        className,
      )}
      style={{
        // @ts-expect-error - Typescript doesn't support css variables
        "--parent-table-columns": gridTemplateColumns,
      }}
      {...props}
    />
  ),
);

const TableHeader = React.forwardRef<
  HTMLDivElement,
  React.ThHTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "_row grid w-full text-xs text-gray-600 font-semibold p-4 py-2 text-left align-middle border-b border-gray-300",
      className,
    )}
    style={{
      ...style,
      gridTemplateColumns: "var(--parent-table-columns)",
    }}
    {...props}
  />
));

type TableRowFC = ComponentWithAs<"div", { clickable?: boolean }>;

// @ts-expect-error - I don't know how to fix this
const TableRow: TableRowFC = React.forwardRef<
  HTMLDivElement,
  PropsWithAs<"div"> & { clickable?: boolean }
>(({ className, style, clickable, as, ...props }, ref) => {
  const Comp = as ?? "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "_row grid w-full p-4 py-2 text-left align-middle font-medium  border-b border-gray-300",
        className,
        {
          "hover:bg-gray-300": clickable,
        },
      )}
      style={{
        ...style,
        gridTemplateColumns: "var(--parent-table-columns)",
      }}
      {...props}
    />
  );
});

const TableCell = React.forwardRef<
  HTMLDivElement,
  React.ThHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-1 h-full overflow-hidden", className)}
    {...props}
  />
));

export { Table, TableHeader, TableRow, TableCell };
