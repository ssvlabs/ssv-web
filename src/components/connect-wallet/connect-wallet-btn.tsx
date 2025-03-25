import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { textVariants } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { shortenAddress } from "@/lib/utils/strings";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import type { FC } from "react";

type WalletType = "ledger" | "trezor" | "walletconnect" | "metamask";

const iconMap: Record<WalletType, string> = {
  ledger: "/images/wallets/ledger.svg",
  trezor: "/images/wallets/trezor.svg",
  walletconnect: "/images/wallets/walletconnect.svg",
  metamask: "/images/wallets/metamask.svg",
};

const getWalletIconSrc = (connectorName?: string) => {
  return (
    iconMap[connectorName?.toLowerCase() as WalletType] ||
    "/images/wallets/metamask.svg"
  );
};
export const ConnectWalletBtn: FC<ButtonProps> = (props) => {
  const account = useAccount();

  // if (my-account.isConnected)
  //   return (
  //     <Button onClick={() => disconnect()}>
  //       {shortenAddress(my-account.address ?? "")}Disconnect
  //     </Button>
  //   );

  // return connectors.map((connector) => (
  //   <Button key={connector.uid} onClick={() => connect({ connector })}>
  //     {connector.name}
  //   </Button>
  // ));

  return (
    <ConnectButton.Custom>
      {({
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;
        if (!mounted) return null;

        if (!connected) {
          return (
            <Button
              data-cy="connect-btn"
              size="lg"
              width="full"
              onClick={openConnectModal}
              {...props}
            >
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button
              size="lg"
              variant="destructive"
              onClick={openChainModal}
              className={textVariants({
                variant: "body-3-medium",
                className: "flex items-center gap-3 h-12 px-4 rounded-xl",
              })}
              {...props}
            >
              <div className="flex gap-1 items-center">
                <span>Wrong Network</span> <ChevronDown className="size-5" />
              </div>
            </Button>
          );
        }

        return (
          <Button
            data-cy="wallet-button"
            size="wallet"
            className={textVariants({
              variant: "body-3-medium",
              className: "flex items-center gap-3 h-12 pl-4 pr-3 rounded-xl",
            })}
            variant="secondary"
            colorScheme="wallet"
            onClick={openAccountModal}
            {...props}
          >
            <div className="relative w-fit h-fit">
              <img
                className="size-6"
                src={getWalletIconSrc(account.connector?.name)}
                alt={`Connected to ${account.address}`}
              />
            </div>
            {shortenAddress(account.address ?? "")}
            {/* {my-account.isContract && (
              <Tooltip content="Onchain wallet">
                <img
                  src="https://pbs.twimg.com/profile_images/1643941027898613760/gyhYEOCE_400x400.jpg"
                  className="size-4 rounded-md"
                />
              </Tooltip>
            )} */}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

ConnectWalletBtn.displayName = "ConnectWalletBtn";
