import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { MEV_RELAYS_LOGOS } from "@/lib/utils/operator";
import { Text } from "@/components/ui/text";

export type MevRelayBadgeProps = {
  mevRelay: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelayBadgeProps> &
    MevRelayBadgeProps
>;

export const MevRelayBadge: FCProps = ({ className, mevRelay, ...props }) => {
  return (
    <div
      className={cn(className, "flex gap-2 p-2 py-1 bg-gray-800 rounded-md")}
      {...props}
    >
      <img src={`/images/mevs/${MEV_RELAYS_LOGOS[mevRelay]}.svg`} />
      <Text>{mevRelay}</Text>
    </div>
  );
};

MevRelayBadge.displayName = "MevRelayBadge";
