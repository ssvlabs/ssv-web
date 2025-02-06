import { api } from "@/lib/api-client.ts";
import { endpoint } from "@/api/index.ts";
import type { Pagination } from "@/types/api.ts";

export type MyBAppAccount = {
  effectiveBalance: bigint;
  delegations: Delegation[];
};

export type Delegation = {
  receiver: {
    id: string;
  };
  percentage: string;
};

export type BAppAccount = {
  bApps: number;
  delegators: number;
  icon: string;
  id: string;
  name: string;
  strategies: number;
  totalDelegated: string;
  totalDelegatedValue: string;
};

export const getMyAccount = (ownerAddress: string) =>
  api
    .get<MyBAppAccount>(
      endpoint(
        "basedApp",
        `getNonSlashableAssets?ownerAddress=${ownerAddress}`,
      ),
    )
    .then((res) => res);

export const getAccounts = ({
  ownerAddress,
  page = 1,
  perPage = 10,
}: {
  ownerAddress?: string;
  page?: number;
  perPage?: number;
}) =>
  api
    .get<{
      data: BAppAccount[];
      pagination: Pagination;
    }>(
      endpoint(
        "basedApp",
        `getAccounts${ownerAddress ? `?ownerAddress=${ownerAddress}` : `?perPage=${perPage}&page=${page}`}`,
      ),
    )
    .then((res) => res);
