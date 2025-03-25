import { getAddress, isAddress } from "viem";
import { useQuery } from "@tanstack/react-query";
import type { BAppAsset } from "@/api/b-app.ts";
import { getBAppsAssetByToken } from "@/api/b-app.ts";
import { useBalances } from "@/hooks/account/use-balances.ts";

export const useGetAsset = (token?: `0x${string}`) => {
  const balance = useBalances([token as `0x${string}`]);
  const query = useQuery({
    queryKey: ["get_asset", token],
    queryFn: () => getBAppsAssetByToken({ token: token || "0x" }),
    enabled: token && isAddress(token),
  });
  const asset = balance.filter(
    ({ token: tokenAddress }) =>
      isAddress(token as `0x${string}`) &&
      getAddress(tokenAddress) === getAddress(token as `0x${string}`),
  )[0];

  return {
    searchAssets: query.data?.length
      ? query.data
      : asset
        ? [{ token: asset.token } as BAppAsset]
        : [],
    isNotSupported: query.data?.length ? false : !!asset,
  };
};
