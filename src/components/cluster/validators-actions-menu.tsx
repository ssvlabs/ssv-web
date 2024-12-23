import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/text";
import { ChevronDown } from "lucide-react";
import { LuTrash2, LuLogOut } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { TbRefreshDot } from "react-icons/tb";
import { useLocalStorage } from "react-use";

type Props = {
  isLiquidated: boolean;
};
export const ValidatorsActionsMenu: FC<ButtonProps & Props> = ({
  className,
  isLiquidated = true,
  ...props
}) => {
  const [enabled] = useLocalStorage("reshareFlowEnabled", false);

  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className} {...props}>
          <Text>Actions</Text> <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("remove")}>
          <LuTrash2 className="size-4" />
          <span>Remove Validators</span>
        </DropdownMenuItem>

        <Tooltip
          side="bottom"
          delayDuration={350}
          asChild
          content={
            isLiquidated
              ? "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed."
              : undefined
          }
        >
          <DropdownMenuItem
            disabled={isLiquidated}
            onClick={() => navigate("exit")}
          >
            <LuLogOut className="size-4" />
            <span>Exit Validators</span>
          </DropdownMenuItem>
          <div className="w-full h-[1px] bg-gray-300" />
          {enabled && (
            <>
              <div className="h-9 flex items-center text-gray-500 text-xs	font-semibold pl-[16px]">
                DKG
              </div>
              <DropdownMenuItem onClick={() => navigate("reshare")}>
                <TbRefreshDot className="size-4" />
                <span>Reshare</span>
              </DropdownMenuItem>
            </>
          )}
        </Tooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ValidatorsActionsMenu.displayName = "ValidatorsActionsMenu";
