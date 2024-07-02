import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Button } from '~app/components/ui/button';
import { formatAddress } from '~lib/utils/strings';

type WalletType = 'ledger' | 'trezor' | 'walletconnect' | 'metamask';

const iconMap: Record<WalletType, string> = {
  ledger: '/images/wallets/ledger.svg',
  trezor: '/images/wallets/trezor.svg',
  walletconnect: '/images/wallets/walletconnect.svg',
  metamask: '/images/wallets/metamask.svg'
};

const getWalletIconSrc = (connectorName?: string) => {
  return iconMap[connectorName?.toLowerCase() as WalletType] || '/images/wallets/metamask.svg';
};

export const WalletButton = () => {
  const { connector } = useAccount();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <div
            className="w-full"
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button size="lg" width="full" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button size="lg" width="full" variant="destructive" onClick={openChainModal}>
                    <div className="flex gap-1 items-center">
                      <span>Wrong Network</span> <ChevronDown className="size-5" />
                    </div>
                  </Button>
                );
              }

              return (
                <div className="flex gap-3">
                  <Button size="network" variant="secondary" colorScheme="wallet" onClick={openChainModal} className="flex items-center gap-3" type="button">
                    {chain.hasIcon && (
                      <div
                        className="size-6"
                        style={{
                          background: chain.iconBackground,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4
                        }}
                      >
                        {chain.iconUrl && <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} className="size-6" />}
                      </div>
                    )}

                    <div className="flex gap-1 items-center">
                      <span> {chain.name}</span> <ChevronDown className="size-5" />
                    </div>
                  </Button>
                  <Button size="wallet" className="gap-3" variant="secondary" colorScheme="wallet" onClick={openAccountModal}>
                    <img className="size-6" src={getWalletIconSrc(connector?.name)} alt={`Connected to ${account.address}`} />
                    {formatAddress(account.address)}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
