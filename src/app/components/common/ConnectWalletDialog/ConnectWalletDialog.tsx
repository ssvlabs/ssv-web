import { DialogProps } from '@radix-ui/react-alert-dialog';
import { FC } from 'react';
import { useLocalStorage } from 'react-use';
import { UseAccountEffectParameters, useAccountEffect, useConnect } from 'wagmi';
import { Checkbox } from '~app/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~app/components/ui/dialog';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { cn } from '~lib/utils/tailwind';
import { WalletOption } from './WalletOption';
import { WalletOptionCard } from './WalletOptionCard';

type Props = {
  onConnect?: UseAccountEffectParameters['onConnect'];
};

export const ConnectWalletDialog: FC<Props & DialogProps> = ({ onConnect, ...props }) => {
  const isDarkMode = useAppSelector(getIsDarkMode);

  const { connectors, connect } = useConnect();
  const [isChecked, setIsChecked] = useLocalStorage('consent', false);

  useAccountEffect({
    onConnect: (data) => {
      props.onOpenChange?.(false);
      onConnect?.(data);
    }
  });

  const isMetaMaskInstalled = Boolean(window.ethereum?.isMetaMask);

  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          {
            dark: isDarkMode
          },
          'p-0 max-w-sm overflow-hidden'
        )}
      >
        <DialogHeader className="gap-2 items-center bg-gray-100 p-6 dark:bg-white/15">
          <img src="/images/ssvIcons/logo.svg" alt="SSV Network" className="size-10" />
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center cursor-pointer gap-2">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked as boolean)} />
            <label htmlFor="terms" className="text-sm font-medium">
              Accept terms and conditions
            </label>
          </div>
          <div className="flex gap-2">
            {connectors.map((connector) => (
              <WalletOption className="flex-1" key={connector.uid} connector={connector} onClick={() => connect({ connector })} disabled={!isChecked} />
            ))}
            {!isMetaMaskInstalled && (
              <WalletOptionCard className="flex-1" iconSrc="/images/wallets/metamask.svg" disabled={!isChecked} onClick={() => window.open('https://metamask.io/download.html')}>
                MetaMask
              </WalletOptionCard>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
