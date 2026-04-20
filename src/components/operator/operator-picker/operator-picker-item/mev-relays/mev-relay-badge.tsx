import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { MEV_RELAYS_LOGOS } from "@/lib/utils/operator";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/app/use-theme";

export type MevRelayBadgeProps = {
  mevRelay: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelayBadgeProps> &
    MevRelayBadgeProps
>;

export const MevRelayBadge: FCProps = ({ className, mevRelay, ...props }) => {
  const { dark } = useTheme();
  const logo = MEV_RELAYS_LOGOS[mevRelay.trim()];

  return (
    <div
      className={cn(
        className,
        "mev-relay-badge flex gap-2 p-2 py-1 bg-gray-200 rounded-md",
      )}
      {...props}
    >
      <img src={`/images/mevs/${logo}${dark ? "-dark" : ""}.svg`} />
      <Text>{mevRelay}</Text>
    </div>
  );
};

MevRelayBadge.displayName = "MevRelayBadge";
