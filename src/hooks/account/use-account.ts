import { queryClient } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useMemo } from "react";
import { useLocalStorage } from "react-use";
import { isAddress } from "viem";
import type { Config, UseAccountReturnType } from "wagmi";
import { usePublicClient, useAccount as useWagmiAccount } from "wagmi";
import { acceptTermsAndConditions } from "@/api/terms.ts";
import { getAccount } from "@wagmi/core";
import { config } from "@/wagmi/config";

export const useAccount = () => {
  const account = useWagmiAccount();
  const publicClient = usePublicClient();
  const [testWalletAddress] = useLocalStorage<Address>(
    "testWalletAddress",
    undefined,
    { raw: true },
  );

  const accountAddress = useMemo(() => {
    if (isAddress(testWalletAddress ?? "")) {
      return testWalletAddress;
    }
    return account.address;
  }, [testWalletAddress, account]);

  const isContractWallet = useQuery({
    staleTime: Infinity,
    queryKey: ["is-contract", accountAddress?.toLowerCase(), account.chainId],
    queryFn: async () =>
      publicClient!
        .getCode({
          address: accountAddress!,
        })
        .then(Boolean),
    enabled: !!accountAddress && !!publicClient,
  });

  const acceptedTerms = useQuery({
    queryKey: [accountAddress, account.chainId],
    queryFn: () =>
      accountAddress &&
      account.chainId === 1 &&
      acceptTermsAndConditions(accountAddress),
  });

  return useMemo(
    () =>
      ({
        ...account,
        address: accountAddress,
        acceptedTerms: acceptedTerms.isSuccess ?? false,
        isContract: isContractWallet.data ?? false,
      }) as UseAccountReturnType<Config> & {
        isContract: boolean;
        acceptedTerms: boolean;
      },
    [account, accountAddress, isContractWallet.data, acceptedTerms.isSuccess],
  );
};

export const isContractWallet = () => {
  const account = getAccount(config);
  return Boolean(
    queryClient
      .getQueriesData({
        exact: false,
        queryKey: [
          "is-contract",
          account.address?.toLowerCase(),
          account.chainId,
        ],
      })
      .at(0)?.[1],
  );
};
