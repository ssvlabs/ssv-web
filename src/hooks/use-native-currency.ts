import { useChainId, useConfig } from "wagmi";

export const useNativeCurrency = () => {
  const chainId = useChainId();
  const { chains } = useConfig();

  return chains.find((chain) => chain.id === chainId)?.nativeCurrency;
};
