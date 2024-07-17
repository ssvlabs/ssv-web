import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Tooltip } from "@/components/ui/tooltip";
import { getMevRelaysAmount } from "@/lib/utils/operator";
import { MevRelaysContent } from "@/components/operator/operator-picker/operator-picker-item/mev-relays/mev-relays-content";

export type MevRelaysProps = {
  mevRelays?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelaysProps> & MevRelaysProps
>;

export const MevRelays: FCProps = ({ className, mevRelays, ...props }) => {
  const mevRelaysAmount = getMevRelaysAmount(mevRelays);
  const hasMevRelays = mevRelaysAmount > 0;
  return (
    <Tooltip
      asChild
      className="dark"
      content={hasMevRelays && <MevRelaysContent mevRelays={mevRelays} />}
    >
      <div
        className={cn(
          className,
          "border bg-gray-50 text-gray-500 border-gray-500 size-7 flex items-center justify-center rounded-md text-sm",
          {
            "bg-primary-50": hasMevRelays,
            "border-primary-400": hasMevRelays,
            "text-primary-400": hasMevRelays,
          },
        )}
        {...props}
      >
        {mevRelaysAmount}
      </div>
    </Tooltip>
  );
};

MevRelays.displayName = "MevRelays";
