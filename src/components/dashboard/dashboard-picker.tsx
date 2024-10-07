import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TextProps } from "@/components/ui/text";
import { Text } from "@/components/ui/text";
import { ChevronDown } from "lucide-react";
import type { FC } from "react";
import { useMatch } from "react-router";
import { Link } from "react-router-dom";

type DashboardPickerFC = FC<TextProps>;

export const DashboardPicker: DashboardPickerFC = ({ ...props }) => {
  const isOperators = Boolean(useMatch("/operators"));
  const isValidators = Boolean(useMatch("/clusters"));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <Text variant="headline3" {...props}>
            {isOperators
              ? "Operators"
              : isValidators
                ? "Validator Clusters"
                : "All"}
          </Text>
          <ChevronDown className="text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild defaultChecked={isValidators} className="">
          <Link to="/clusters">Validator Clusters</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild defaultChecked={isOperators}>
          <Link to="/operators">Operators</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DashboardPicker.displayName = "DashboardPicker";
