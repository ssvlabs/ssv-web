import { Button, ButtonProps } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import type { FC } from "react";

export const NetworkSwitchBtn: FC<ButtonProps> = (props) => {
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
            className="flex items-center gap-3"
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

            <div className="flex gap-1 items-center">
              <span> {chain.name}</span> <ChevronDown className="size-5" />
            </div>
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

NetworkSwitchBtn.displayName = "NetworkSwitchBtn";
