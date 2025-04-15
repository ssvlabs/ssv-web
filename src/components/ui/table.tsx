import * as React from "react";

import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { Slot } from "@radix-ui/react-slot";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm font-medium", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b bg-gray-100 text-xs text-gray-500 whitespace-nowrap",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-b-gray-200 transition-colors bg-gray-50 hover:bg-gray-200 data-[state=selected]:bg-gray-300",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-[52px] px-7 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 bg-white border-b border-gray-300",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "h-[52px] px-7 py-3 text-base font-medium align-middle [&:has([role=checkbox])]:pr-0 text-[14px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const TableMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
    activeCount?: number;
    isActive?: boolean;
  }
>(({ className, icon, activeCount, isActive, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "group flex h-10 select-none items-center gap-2 whitespace-nowrap rounded-xl border border-transparent bg-gray-50 px-4 text-sm font-medium transition-colors hover:bg-gray-100",
      {
        "border border-primary-500": isActive,
        "pr-2": activeCount && activeCount > 0,
      },
      className,
    )}
    {...props}
  >
    {icon && (
      <Slot
        className={cn(
          "size-4 text-gray-500 transition-colors group-hover:text-gray-800",
          {
            "text-gray-800": isActive,
          },
        )}
      >
        {icon}
      </Slot>
    )}
    {children}
    {Boolean(activeCount) && (
      <div className="rounded-md bg-primary-50 px-2 py-[2px]">
        <Text
          variant="body-3-semibold"
          className={cn("text-primary-500")}
          style={{
            width: `${(activeCount?.toString().length ?? 1) * 0.9}ch`,
          }}
        >
          {activeCount}
        </Text>
      </div>
    )}
  </button>
));
TableMenuButton.displayName = "TableMenuButton";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableMenuButton,
};
