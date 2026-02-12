import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { textVariants } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { FC } from "react";
import { useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { mainnet } from "wagmi/chains";

const networkRedirects: Record<number, URL> = {
  [mainnet.id]: new URL("https://app.ssv.network/"),
};

export const NetworkSwitchBtn: FC<ButtonProps> = (props) => {
  const { chain: accountChain, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !accountChain?.id) return;
    const targetBaseUrl = networkRedirects[accountChain.id];
    if (!targetBaseUrl) return;

    const targetUrl = new URL(window.location.pathname, targetBaseUrl.origin);
    if (window.location.origin === targetUrl.origin) return;

    window.location.assign(targetUrl.toString());
  }, [accountChain?.id, isConnected]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, mounted }) => {
        const connected = mounted && account && chain;
        if (!connected) return null;

        return (
          <Button
            data-cy="network-button"
            size="network"
            variant="secondary"
            colorScheme="wallet"
            onClick={openChainModal}
            className={textVariants({
              variant: "body-3-medium",
              className: "flex items-center gap-3 h-12 pl-4 pr-3 rounded-xl",
            })}
            type="button"
            {...props}
          >
            {chain.hasIcon && (
              <div
                className="size-6"
                style={{
                  background: chain.iconBackground,
                  borderRadius: 999,
                  overflow: "hidden",
                  marginRight: 4,
                }}
              >
                {chain.iconUrl && (
                  <img
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    className="size-6"
                  />
                )}
              </div>
            )}

            <span>{chain.name}</span>
            <div className="size-6 flex items-center justify-center -ml-1">
              <FaChevronDown className="size-3" />
            </div>
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

NetworkSwitchBtn.displayName = "NetworkSwitchBtn";
