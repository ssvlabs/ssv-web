import { useTheme } from "@/hooks/app/use-theme";
import { useAsset } from "@/hooks/use-asset";
import { onlyTokens } from "@/lib/utils/tokens.ts";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";

export type AssetLogoProps = {
  address: Address;
  fallbackAssetSrc?: string;
};

type AssetLogoFC = FC<
  Omit<ComponentPropsWithoutRef<"img">, keyof AssetLogoProps> & AssetLogoProps
>;

export const AssetLogo: AssetLogoFC = ({
  address,
  fallbackAssetSrc = "/images/networks/light.svg",
  className,
  ...props
}) => {
  const { dark } = useTheme();

  const asset = useAsset(address);
  const logoSrc = asset.isEthereum
    ? dark
      ? "/images/networks/light.svg"
      : "/images/networks/dark.svg"
    : onlyTokens[asset.symbol?.toUpperCase() || ""] || fallbackAssetSrc;

  return (
    <img
      {...props}
      className={cn("flex flex-wrap size-6 gap-1 rounded-md", className)}
      src={logoSrc}
    />
  );
};

AssetLogo.displayName = "AssetLogo";
