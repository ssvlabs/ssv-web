import type { ComponentProps, FC, ReactNode } from "react";
import { Tooltip } from "@/components/ui/tooltip";

const SWITCH_TO_ETH_MENU_OPTION_TOOLTIP_TEXT =
  "Switch to ETH to enable this option";

type Props = Omit<ComponentProps<typeof Tooltip>, "content" | "children"> & {
  enabled?: boolean;
  children: ReactNode;
};

export const SwitchToEthMenuOptionTooltip: FC<Props> = ({
  enabled,
  children,
  ...tooltipProps
}) => {
  return (
    <Tooltip
      asChild
      content={enabled ? SWITCH_TO_ETH_MENU_OPTION_TOOLTIP_TEXT : undefined}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};

SwitchToEthMenuOptionTooltip.displayName = "SwitchToEthMenuOptionTooltip";
