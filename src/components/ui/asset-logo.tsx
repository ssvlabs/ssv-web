import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import { onlyTokens } from "@/lib/utils/tokens.ts";
import { useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token";
import { isEthereumAddress } from "@/lib/utils/token";
import { useTheme } from "@/hooks/app/use-theme";

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
  const isEthereum = isEthereumAddress(address);

  const { data: tokenSymbol = "ETH" } = useReadContract({
    abi: TokenABI,
    functionName: "symbol",
    address,
    query: {
      staleTime: Infinity,
      enabled: !isEthereum,
    },
  });

  const logoSrc = isEthereum
    ? dark
      ? "/images/networks/light.svg"
      : "/images/networks/dark.svg"
    : onlyTokens[tokenSymbol?.toUpperCase() || ""] || fallbackAssetSrc;

  return (
    <img
      {...props}
      className={cn("flex flex-wrap size-6 gap-1 rounded-md", className)}
      src={logoSrc}
    />
  );
};

AssetLogo.displayName = "AssetLogo";
