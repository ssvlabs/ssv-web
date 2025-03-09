import { useAccount } from "@/hooks/account/use-account";
import { useBalanceOf } from "@/lib/contract-interactions/erc-20/read/use-balance-of";
import { useDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals";
import { useName } from "@/lib/contract-interactions/erc-20/read/use-name";
import { useSymbol } from "@/lib/contract-interactions/erc-20/read/use-symbol";
import { ms } from "@/lib/utils/number";
import { isEthereumTokenAddress } from "@/lib/utils/token";
import { useQueryClient } from "@tanstack/react-query";
import { useBalance } from "wagmi";

export const useAsset = (tokenAddress?: `0x${string}`) => {
  const isEthereum = tokenAddress && isEthereumTokenAddress(tokenAddress);
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const queryOptions = {
    staleTime: Infinity,
    enabled: !isEthereum && !!tokenAddress,
  };
  console.log("tokenAddress:", tokenAddress);

  const { data: name = "Unknown" } = useName({ tokenAddress }, queryOptions);
  const { data: symbol = "" } = useSymbol({ tokenAddress }, queryOptions);
  const { data: decimals = 18 } = useDecimals({ tokenAddress }, queryOptions);
  const { data: balance = 0n, queryKey } = useBalanceOf(
    { tokenAddress, account: address! },
    {
      enabled: !isEthereum && !!tokenAddress && !!address,
      staleTime: ms(1, "minutes"),
    },
  );

  const ethBalance = useBalance({
    address: address!,
    query: {
      enabled: isEthereum,
    },
  });

  return {
    name: isEthereum ? "Ethereum" : name,
    symbol: isEthereum ? "ETH" : symbol,
    decimals,
    balance: isEthereum ? ethBalance.data?.value : balance,
    isEthereum,
    refreshBalance: () => {
      queryClient.invalidateQueries({
        queryKey: ethBalance.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  };
};
