import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import { onlyTokens } from "@/lib/utils/tokens.ts";

export type AssetLogoProps = {
  address: Address;
  assetsData: Record<string, { symbol: string; name: string }>;
};

type AssetLogoFC = FC<
  Omit<ComponentPropsWithoutRef<"img">, keyof AssetLogoProps> & AssetLogoProps
>;

export const AssetLogo: AssetLogoFC = ({
  address,
  className,
  assetsData,
  ...props
}) => {
  const tokenSymbol =
    (assetsData as Record<string, { symbol: string; name: string }>)[address]
      ?.symbol || "";
  const logoSrc =
    onlyTokens[tokenSymbol.toUpperCase()] ||
    "/images/operator_default_background/light.svg";

  return (
    <img
      {...props}
      className={cn("flex flex-wrap gap-1 rounded-md", className)}
      src={logoSrc}
    />
  );
};

AssetLogo.displayName = "AssetLogo";
