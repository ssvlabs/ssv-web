import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "@/components/ui/text";
import { ChevronDown } from "lucide-react";
import { LuLogOut, LuTrash2 } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { TbRefreshDot } from "react-icons/tb";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";

type Props = {
  isLiquidated: boolean;
  isMigrated?: boolean;
};

enum ActionType {
  Remove = "remove",
  Exit = "exit",
  Reshare = "reshare",
}
export const ValidatorsActionsMenu: FC<ButtonProps & Props> = ({
  className,
  isLiquidated = true,
  isMigrated,
  ...props
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSsvCluster = !isMigrated;

  const onActionClickHandler = (action: ActionType) => {
    useBulkActionContext.resetState();
    navigate(`${action}${location.search}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className} {...props}>
          <Text>Actions</Text> <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Tooltip
          side="right"
          delayDuration={0}
          content={isSsvCluster ? "Switch to ETH to enable this option" : undefined}
        >
          <div>
            <DropdownMenuItem
              disabled={isSsvCluster}
              onClick={() => onActionClickHandler(ActionType.Remove)}
            >
              <LuTrash2 className="size-4" />
              <span>Remove Validators</span>
            </DropdownMenuItem>
          </div>
        </Tooltip>

        <Tooltip
          side="right"
          delayDuration={0}
          content={
            isLiquidated
              ? "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed."
              : undefined
          }
        >
          <div>
            <DropdownMenuItem
              disabled={isLiquidated}
              onClick={() => onActionClickHandler(ActionType.Exit)}
            >
              <LuLogOut className="size-4" />
              <span>Exit Validators</span>
            </DropdownMenuItem>
          </div>
        </Tooltip>
        <>
          <div className="w-full h-[1px] bg-gray-300" />
          <div className="h-9 flex items-center text-gray-500 text-xs	font-semibold pl-[16px]">
            DKG
          </div>
          <Tooltip
            side="right"
            delayDuration={0}
            content={isSsvCluster ? "Switch to ETH to enable this option" : undefined}
          >
            <div>
              <DropdownMenuItem
                disabled={isSsvCluster}
                onClick={() => onActionClickHandler(ActionType.Reshare)}
              >
                <TbRefreshDot className="size-4" />
                <span>Reshare</span>
              </DropdownMenuItem>
            </div>
          </Tooltip>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ValidatorsActionsMenu.displayName = "ValidatorsActionsMenu";
