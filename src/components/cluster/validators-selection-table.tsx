import { useState, type FC } from "react";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { Text } from "@/components/ui/text";
import { CopyBtn } from "@/components/ui/copy-btn";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type {
  TaggedValidators,
  ValidatorShareWithStatus,
} from "@/hooks/keyshares/use-keyshares-validators-state-validation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ValidatorsSelectionTableProps = {
  taggedValidators: TaggedValidators;
  sharesWithStatuses: ValidatorShareWithStatus[];
  selectedAmount: number;
};
type Tags = keyof TaggedValidators;

export const ValidatorsSelectionTable: FC<ValidatorsSelectionTableProps> = ({
  taggedValidators,
  sharesWithStatuses,
  selectedAmount,
}) => {
  const [selectedTag, setSelectedTag] = useState<Tags>(() => {
    if (taggedValidators.available.length > 0) return "available";
    if (taggedValidators.registered.length > 0) return "registered";
    if (taggedValidators.incorrect.length > 0) return "incorrect";
    return "all";
  });

  const statuses = {
    available: "Available",
    registered: "Registered",
    incorrect: "Incorrect owner-nonce",
  };

  return (
    <div className="flex flex-col gap-5 flex-1">
      <Tabs
        value={selectedTag}
        onValueChange={(value) => setSelectedTag(value as Tags)}
      >
        <TabsList className="flex w-full [&>*]:flex-1">
          <TabsTrigger
            className="flex items-center gap-1"
            value="available"
            disabled={taggedValidators.available.length === 0}
          >
            <Text>Available</Text>
            <Badge className="rounded-lg" variant="primary" size="xs">
              {taggedValidators.available.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-1"
            value="registered"
            disabled={taggedValidators.registered.length === 0}
          >
            <Text>Registered</Text>
            <Badge className="rounded-lg" variant="success" size="xs">
              {taggedValidators.registered.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-1"
            value="incorrect"
            disabled={taggedValidators.incorrect.length === 0}
          >
            <Text>Incorrect</Text>
            <Badge className="rounded-lg" variant="error" size="xs">
              {taggedValidators.incorrect.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-1"
            value="all"
            disabled={taggedValidators.all.length === 0}
          >
            <Text>All</Text>
            <Badge className="rounded-lg" variant="info" size="xs">
              {taggedValidators.all.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Table gridTemplateColumns="1fr auto" className="flex-1 max-h-[580px]">
        <TableHeader className="sticky z-10 top-0 bg-gray-50">
          <TableCell>Public key</TableCell>
          <TableCell>Status</TableCell>
        </TableHeader>
        {(() => {
          let selectedValidatorsCount = 0;

          return sharesWithStatuses.map((validator) => {
            if (validator.status !== selectedTag && selectedTag !== "all")
              return null;
            const selected =
              validator.status === "available" &&
              selectedValidatorsCount < selectedAmount;
            const isFirstValidator = selectedValidatorsCount === 0;
            if (selected) selectedValidatorsCount++;
            return (
              <TableRow
                key={validator.share.payload.publicKey}
                className={cn({
                  "bg-primary-50 font-bold border border-primary-500": selected,
                  "border-t-0": selected && !isFirstValidator,
                  "bg-gray-100": validator.status === "registered",
                  "bg-red-400/10": validator.status === "incorrect",
                })}
              >
                <TableCell className="flex gap-1 items-center">
                  <Text>
                    {shortenAddress(validator.share.payload.publicKey)}
                  </Text>
                  <CopyBtn
                    className="z-0"
                    text={validator.share.payload.publicKey}
                  />
                </TableCell>
                <TableCell>
                  {validator.status !== "available" && (
                    <Badge
                      size="sm"
                      variant={
                        validator.status === "registered" ? "success" : "error"
                      }
                    >
                      {statuses[validator.status]}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          });
        })()}
      </Table>
    </div>
  );
};
