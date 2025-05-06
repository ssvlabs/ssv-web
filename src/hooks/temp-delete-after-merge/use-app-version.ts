import { useAccount } from "@/hooks/account/use-account";

export const useAppVersion = () => {
  const account = useAccount();
  const isTestnet = account.chain?.testnet;

  return {
    isDvtOnly: !isTestnet,
    isWithBapp: isTestnet,
  };
};
