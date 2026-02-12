import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/tw";
import type { FC } from "react";
import { LuMoreVertical } from "react-icons/lu";
import { TbAdjustments, TbEdit, TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router";

export const OperatorSettingsBtn: FC<ButtonProps> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...props}
          size="icon"
          variant="subtle"
          className={cn(className, "rounded-full size-10")}
        >
          <LuMoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-700">
        <DropdownMenuItem onClick={() => navigate("settings")}>
          <TbAdjustments className="size-6" /> Permission Settings
        </DropdownMenuItem>{" "}
        <DropdownMenuItem onClick={() => navigate("details")}>
          <TbEdit className="size-6 " /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-error-500"
          onClick={() => navigate("remove")}
        >
          <TbTrash className="size-6" /> Remove Operator
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

OperatorSettingsBtn.displayName = "OperatorSettingsBtn";
