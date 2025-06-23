import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { MEV_RELAYS_LOGOS } from "@/lib/utils/operator";
import { useTheme } from "@/hooks/app/use-theme";
import { Tooltip } from "@/components/ui/tooltip";
import { Text } from "@/components/ui/text";

export type MevRelaysDisplayProps = {
  mevRelays: string;
};

type MevRelaysDisplayFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof MevRelaysDisplayProps> &
    MevRelaysDisplayProps
>;

export const MevRelaysDisplay: MevRelaysDisplayFC = ({
  mevRelays,
  className,
  ...props
}) => {
  const { dark } = useTheme();

  return (
    <div className={cn("flex gap-0.5", className)} {...props}>
      {Object.entries(MEV_RELAYS_LOGOS).map(([mev, logo]) => {
        const isSelected = mevRelays.includes(mev);
        return (
          <Tooltip
            asChild
            key={mev}
            content={
              <div className="flex gap-3 items-center">
                <img
                  src={`/images/mevs/${logo}${"-dark"}.svg`}
                  className={cn("size-10")}
                  alt={mev}
                />
                <Text>{mev}</Text>
              </div>
            }
          >
            <div
              key={mev}
              className={cn(
                "size-[14px] bg-gray-200 rounded-sm flex items-center justify-center border border-transparent",
                {
                  "border-primary-500 bg-primary-50": isSelected,
                  "opacity-60": !isSelected,
                },
              )}
            >
              <img
                src={`/images/mevs/${logo}${dark ? "-dark" : ""}.svg`}
                className={cn("size-[8px]")}
                alt={mev}
              />
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

MevRelaysDisplay.displayName = "MevRelaysDisplay";
