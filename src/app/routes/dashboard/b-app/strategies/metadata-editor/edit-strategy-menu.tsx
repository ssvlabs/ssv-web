import type { FC, ComponentPropsWithoutRef } from "react";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMetadataEditorModal } from "@/signals/modal";
import { useParams } from "react-router";

export type EditStrategyMenuProps = {
  strategyId?: string;
};

type EditStrategyMenuFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof EditStrategyMenuProps> &
    EditStrategyMenuProps &
    ButtonProps
>;

export const EditStrategyMenu: EditStrategyMenuFC = ({
  className,
  strategyId,
  ...props
}) => {
  const metadataEditorModal = useMetadataEditorModal();
  const id = useParams().strategyId || strategyId;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className} {...props}>
          Edit Strategy
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            metadataEditorModal.open({
              strategyId: id || "",
            });
          }}
        >
          Edit Metadata
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

EditStrategyMenu.displayName = "EditStrategyMenu";
