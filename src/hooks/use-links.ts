import { useMemo } from "react";
import { useAccount } from "@/hooks/account/use-account";

export const useLinks = () => {
  const { chain } = useAccount();
  return useMemo(() => {
    const chainPrefix = chain?.testnet ? `${chain.name.toLowerCase()}.` : "";
    return {
      beaconcha: `https://${chainPrefix}beaconcha.in`,
      launchpad: `https://${chainPrefix}launchpad.ethereum.org`,
      etherscan: `https://${chainPrefix}etherscan.io`,
      ssv: {
        explorer: import.meta.env.VITE_EXPLORER_URL,
        stake: import.meta.env.VITE_STAKE_URL,
        docs: `https://docs.ssv.network`,
        forum: `https://forum.ssv.network/`,
        governanceForum: `https://forum.ssv.network/`,
        snapshot: `https://snapshot.org/#/mainnet.ssvnetwork.eth`,
        tos: "https://ssv.network/terms-of-use/",
        privacy: "https://ssv.network/privacy-policy/",
        discord: "https://discord.com/invite/ssvnetworkofficial",
        x: "https://x.com/ssv_network",
        website: "https://ssv.network/",
      },
    };
  }, [chain?.name, chain?.testnet]);
};
