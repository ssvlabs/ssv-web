import { Text } from "@/components/ui/text";
import { MevRelayBadge } from "@/components/operator/operator-picker/operator-picker-item/mev-relays/mev-relay-badge";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export type MevRelaysProps = {
  mevRelays?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelaysProps> & MevRelaysProps
>;

export const MevRelaysContent: FCProps = ({
  className,
  mevRelays,
  ...props
}) => {
  return (
    <div className={cn(className, "flex flex-col gap-3")} {...props}>
      <Text variant="body-2-semibold">Supported MEV Relays</Text>
      <div className="flex gap-1 flex-wrap">
        {mevRelays
          ?.split(",")
          .map((mevRelay, index) => (
            <MevRelayBadge key={index} mevRelay={mevRelay} />
          ))}
      </div>
    </div>
  );
};

MevRelaysContent.displayName = "MevRelaysContent";
