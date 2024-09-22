import { useMemo } from "react";
import { useAccount } from "@/hooks/account/use-account";

export const useLinks = () => {
  const { chain } = useAccount();
  return useMemo(() => {
    const prefix = chain?.testnet ? `${chain.name.toLowerCase()}.` : "";
    const ssvPrefix = chain?.testnet ? `.stage` : "";
    return {
      beaconcha: `https://${prefix}beaconcha.in`,
      launchpad: `https://${prefix}launchpad.ethereum.org`,
      etherscan: `https://${prefix}etherscan.io`,
      ssv: {
        explorer: `https://explorer${ssvPrefix}.ssv.network`,
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
