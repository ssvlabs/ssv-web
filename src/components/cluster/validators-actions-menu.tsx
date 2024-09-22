import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Text } from "@/components/ui/text";
import { ChevronDown } from "lucide-react";
import { LuTrash2, LuLogOut } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

type Props = {
  isLiquidated: boolean;
};
export const ValidatorsActionsMenu: FC<ButtonProps & Props> = ({
  className,
  isLiquidated,
  ...props
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className} {...props}>
          <Text>Actions</Text> <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link to="remove">
          <DropdownMenuItem>
            <LuTrash2 className="size-4" />
            <span>Remove Validators</span>
          </DropdownMenuItem>
        </Link>
        <Tooltip
          side="bottom"
          delayDuration={350}
          content={
            isLiquidated
              ? "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed."
              : undefined
          }
        >
          <Link to="exit">
            <DropdownMenuItem disabled={isLiquidated}>
              <LuLogOut className="size-4" />
              <span>Exit Validators</span>
            </DropdownMenuItem>
          </Link>
        </Tooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ValidatorsActionsMenu.displayName = "ValidatorsActionsMenu";
