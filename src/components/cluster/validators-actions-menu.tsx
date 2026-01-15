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
import { LuTrash2, LuLogOut } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { TbRefreshDot } from "react-icons/tb";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import { SwitchToEthMenuOptionTooltip } from "@/components/cluster/switch-to-eth-menu-option-tooltip";

type Props = {
  isLiquidated: boolean;
  isSSVCluster?: boolean;
};

enum ActionType {
  Remove = "remove",
  Exit = "exit",
  Reshare = "reshare",
}
export const ValidatorsActionsMenu: FC<ButtonProps & Props> = ({
  className,
  isLiquidated = true,
  isSSVCluster,
  ...props
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onActionClickHandler = (action: ActionType) => {
    useBulkActionContext.resetState();
    navigate(`${action}${location.search}`);
  };

  return (
    <DropdownMenu>
      <SwitchToEthMenuOptionTooltip enabled={isSSVCluster}>
        <DropdownMenuTrigger asChild disabled={isSSVCluster}>
          <Button variant="secondary" className={className} {...props}>
            <Text>Actions</Text> <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </SwitchToEthMenuOptionTooltip>

      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isSSVCluster}
          onClick={() => onActionClickHandler(ActionType.Remove)}
        >
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
            onClick={() => onActionClickHandler(ActionType.Exit)}
          >
            <LuLogOut className="size-4" />
            <span>Exit Validators</span>
          </DropdownMenuItem>
        </Tooltip>
        <>
          <div className="w-full h-[1px] bg-gray-300" />
          <div className="h-9 flex items-center text-gray-500 text-xs	font-semibold pl-[16px]">
            DKG
          </div>
          <DropdownMenuItem
            onClick={() => onActionClickHandler(ActionType.Reshare)}
          >
            <TbRefreshDot className="size-4" />
            <span>Reshare</span>
          </DropdownMenuItem>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ValidatorsActionsMenu.displayName = "ValidatorsActionsMenu";
