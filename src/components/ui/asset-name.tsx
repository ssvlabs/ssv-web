import { Text } from "@/components/ui/text.tsx";
import { useAsset } from "@/hooks/use-asset";

import type { ComponentPropsWithoutRef, FC } from "react";
import type { Address } from "abitype";
import { cn } from "@/lib/utils/tw";

export type AssetNameProps = {
  address: Address;
};

type AssetNameFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof AssetNameProps> & AssetNameProps
>;

const AssetName: AssetNameFC = ({ address, className }) => {
  const asset = useAsset(address);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Text>{asset.name}</Text>
      <Text className="text-gray-500 font-medium">{asset.symbol}</Text>
    </div>
  );
};

export default AssetName;
