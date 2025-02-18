import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import { AssetLogo } from "@/components/ui/asset-logo";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";

export type AssetsDisplayProps = {
  addresses: Address[];
  max?: number;
  assetsData: Record<string, { symbol: string; name: string }>;
};

type AssetsDisplayFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof AssetsDisplayProps> &
    AssetsDisplayProps
>;

export const AssetsDisplay: AssetsDisplayFC = ({
  addresses,
  max = addresses.length,
  className,
  assetsData,
  ...props
}) => {
  const visible = addresses.slice(0, max);
  const hidden = addresses.slice(max);
  return (
    <div className={cn("flex flex-wrap gap-1", className)} {...props}>
      {visible.map((address) => (
        <AssetLogo
          key={address}
          className="size-6"
          address={address}
          assetsData={assetsData}
        />
      ))}
      {hidden.length > 0 && (
        <Tooltip
          content={<AssetsDisplay addresses={hidden} assetsData={assetsData} />}
        >
          <div className="flex items-center justify-center min-w-6 h-6 px-1 rounded-sm bg-primary-50 border border-primary-200">
            <Text
              variant="body-2-medium"
              className="text-[10px] text-primary-600"
            >
              +{hidden.length}
            </Text>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

AssetsDisplay.displayName = "AssetsDisplay";
