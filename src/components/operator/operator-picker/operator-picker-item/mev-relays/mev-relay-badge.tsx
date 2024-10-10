import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { MEV_RELAYS_LOGOS } from "@/lib/utils/operator";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/app/use-theme";
import { useIsInsideTooltip } from "@/components/ui/tooltip";

export type MevRelayBadgeProps = {
  mevRelay: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelayBadgeProps> &
    MevRelayBadgeProps
>;

export const MevRelayBadge: FCProps = ({ className, mevRelay, ...props }) => {
  const { dark } = useTheme();
  const { ref, isInsideTooltip } = useIsInsideTooltip();
  const isDark = isInsideTooltip || dark;
  const logo = MEV_RELAYS_LOGOS[mevRelay.trim()];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        className,
        "mev-relay-badge flex gap-2 p-2 py-1 bg-gray-800 rounded-md",
        {
          "bg-gray-200": dark,
        },
      )}
      {...props}
    >
      <img src={`/images/mevs/${logo}${isDark ? "-dark" : ""}.svg`} />
      <Text>{mevRelay}</Text>
    </div>
  );
};

MevRelayBadge.displayName = "MevRelayBadge";
