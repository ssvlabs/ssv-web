import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { Text } from "@/components/ui/text";
import { shortenAddress } from "@/lib/utils/strings";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Badge } from "@/components/ui/badge";

export type ValidatorsBulkSummaryProps = {
  publicKeys: (string | Address)[];
};

type ValidatorsBulkSummaryFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ValidatorsBulkSummaryProps> &
    ValidatorsBulkSummaryProps
>;

export const ValidatorsBulkSummary: ValidatorsBulkSummaryFC = ({
  publicKeys,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex justify-between">
        <Text variant="headline4">Summary</Text>
        <Badge variant="primary">{publicKeys.length} validators</Badge>
      </div>
      <Table
        gridTemplateColumns="1fr"
        className="flex-1 min-h-60 max-h-[400px]"
      >
        <TableHeader className="sticky top-0 bg-gray-50 z-10">
          <TableCell>Public key</TableCell>
        </TableHeader>
        {publicKeys.map((publicKey) => (
          <TableRow key={publicKey}>
            <TableCell className="flex gap-1 items-center">
              <Text>{shortenAddress(publicKey)}</Text>
              <CopyBtn text={publicKey} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

ValidatorsBulkSummary.displayName = "ValidatorsBulkSummary";
