import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '~app/components/ui/button';
import { useDispatch } from 'react-redux';
import { setIsShowSsvLoader } from '~app/redux/appState.slice.ts';

type WalletType = 'ledger' | 'trezor' | 'walletconnect' | 'metamask';

const iconMap: Record<WalletType, string> = {
  ledger: '/images/wallets/ledger.svg',
  trezor: '/images/wallets/trezor.svg',
  walletconnect: '/images/wallets/walletconnect.svg',
  metamask: '/images/wallets/metamask.svg'
};

const getWalletIconSrc = (connectorName?: string) => {
  return iconMap[connectorName as WalletType] || '/images/wallets/metamask.svg';
};

export const WalletButton = () => {
  const { connector } = useAccount();
  const dispatch = useDispatch();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = mounted && account && chain;
        if (!connected) {
          dispatch(setIsShowSsvLoader(false));
        }

        return (
          <div
            {...(!ready && {
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
                  <Button size="lg" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button variant="destructive" onClick={openChainModal}>
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex gap-3">
                  <Button size="lg" variant="ghost" onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button">
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
                    {chain.name}
                  </Button>
                  <Button size="lg" className="gap-3" variant="outline" onClick={openAccountModal}>
                    <img className="size-6" src={getWalletIconSrc(connector?.name)} alt={`Connected to ${account.address}`} />
                    {account.displayName}
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
