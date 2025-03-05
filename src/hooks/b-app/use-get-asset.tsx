import { isAddress } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getBAppsAssetByToken } from "@/api/b-app.ts";

export const useGetAsset = (token?: `0x${string}`) => {
  const query = useQuery({
    queryKey: ["get_asset", token],
    queryFn: () => getBAppsAssetByToken({ token: token || "0x" }),
    enabled: token && isAddress(token),
  });

  return { query };
};
