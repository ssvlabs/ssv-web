import { useAccount } from "@/hooks/account/use-account";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { useSlashableAssets } from "@/hooks/b-app/use-slashable-assets";
import { useQueries } from "@tanstack/react-query";
import { fetchBalanceOf } from "@/lib/contract-interactions/erc-20/read/use-balance-of";
import { isEthereumTokenAddress } from "@/lib/utils/token";
import { useBalance } from "wagmi";
import { fetchDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals";
import type { SlashableAsset } from "@/api/b-app";
import type { Address } from "abitype";

// Mock data for testing
export const mockAccountAssets: AccountAsset[] = [
  {
    token: "0x1234567890123456789012345678901234567890",
    slashableAsset: {
      token: "0x1234567890123456789012345678901234567890",
      deposits: [
        {
          strategyId: "1",
          depositAmount: "500000000000000000",
          fiatDepositAmount: "1000",
        },
      ],
      totalDepositAmount: "500000000000000000",
      totalFiatDepositAmount: "1000",
    },
    tokenInfo: {
      balance: BigInt("2000000000000000000"),
      decimals: 18,
    },
    totalDepositAmount: "1000000000000000000",
    totalFiatDepositAmount: "1000",
  },
  {
    token: "0x2345678901234567890123456789012345678901",
    tokenInfo: {
      balance: BigInt("5000000000000000000"),
      decimals: 18,
    },
    totalDepositAmount: "3000000000000000000",
    totalFiatDepositAmount: "3000",
  },
  {
    token: "0x3456789012345678901234567890123456789012",
    slashableAsset: {
      token: "0x3456789012345678901234567890123456789012",
      deposits: [
        {
          strategyId: "2",
          depositAmount: "2000000000000000000",
          fiatDepositAmount: "4000",
        },
        {
          strategyId: "3",
          depositAmount: "2000000000000000000",
          fiatDepositAmount: "4000",
        },
      ],
      totalDepositAmount: "4000000000000000000",
      totalFiatDepositAmount: "8000",
    },
    tokenInfo: {
      balance: BigInt("10000000000000000000"),
      decimals: 18,
    },
    totalDepositAmount: "4000000000000000000",
    totalFiatDepositAmount: "8000",
  },
];

export type AccountAsset = {
  slashableAsset?: SlashableAsset;
  tokenInfo: {
    balance: bigint;
    decimals: number;
  };
  token: Address;
  totalDepositAmount: string;
  totalFiatDepositAmount: string;
};

export const useAccountAssets = () => {
  const account = useAccount();
  const {
    assets,
    query: { isLoading: isAssetsLoading },
  } = useBAppsAssets();
  const { data: slashableAssets, isLoading: isSlashableAssetsLoading } =
    useSlashableAssets();

  const isLoading = isAssetsLoading || isSlashableAssetsLoading;

  const delegationsMap = new Map(
    slashableAssets?.data.map((a) => [a.token.toLocaleLowerCase(), a]),
  );

  const ethBalance = useBalance({ address: account.address! });

  const balances = useQueries({
    queries: assets
      ?.filter((a) => !isEthereumTokenAddress(a.token))
      .map((asset) => ({
        queryKey: ["balance", asset.token, account.address],
        queryFn: async () => {
          return [
            asset.token.toLocaleLowerCase(),
            {
              balance: await fetchBalanceOf(asset.token, {
                account: account.address!,
              }),
              decimals: await fetchDecimals(asset.token),
            },
          ] as [string, { balance: bigint; decimals: number }];
        },
      })),
    combine: (results) => {
      const validResults = results
        .filter((r) => r.data != null)
        .map((r) => r.data) as [
        string,
        { balance: bigint; decimals: number },
      ][];
      return new Map(validResults);
    },
  });

  const accountAssets = assets.map((a) => {
    const isEth = isEthereumTokenAddress(a.token);
    const delegations = delegationsMap.get(a.token.toLocaleLowerCase());
    return {
      ...a,
      slashableAsset: delegations,
      totalDepositAmount: delegations?.totalDepositAmount || "0",
      totalFiatDepositAmount: delegations?.totalFiatDepositAmount || "0",
      tokenInfo: isEth
        ? {
            balance: ethBalance.data?.value || 0n,
            decimals: 18,
          }
        : balances.get(a.token.toLocaleLowerCase()) || {
            balance: 0n,
            decimals: 0,
          },
    } satisfies AccountAsset;
  });

  return {
    assets: accountAssets,
    isLoading,
  };
};
