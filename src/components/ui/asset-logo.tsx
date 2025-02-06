import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import { getAssetLogoSrc } from "@/lib/utils/token";

export type AssetLogoProps = {
  address: Address;
};

type AssetLogoFC = FC<
  Omit<ComponentPropsWithoutRef<"img">, keyof AssetLogoProps> & AssetLogoProps
>;

export const AssetLogo: AssetLogoFC = ({ address, className, ...props }) => {
  return (
    <img
      {...props}
      className={cn("flex flex-wrap gap-1 rounded-md", className)}
      src={getAssetLogoSrc(address)}
    />
  );
};

AssetLogo.displayName = "AssetLogo";
