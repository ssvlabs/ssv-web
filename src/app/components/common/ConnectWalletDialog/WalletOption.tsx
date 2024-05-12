import { useQuery } from '@tanstack/react-query';
import { ComponentPropsWithoutRef, FC } from 'react';
import { Connector } from 'wagmi';
import { WalletOptionCard } from './WalletOptionCard';

type Props = {
  connector: Connector;
  onClick: () => void;
  isLoading?: boolean;
};

const ICONS: Record<string, string> = {
  walletConnect: '/images/wallets/walletconnect.svg',
  'io.metamask': '/images/wallets/metamask.svg'
};

export const WalletOption: FC<Props & ComponentPropsWithoutRef<'button'>> = ({ connector, ...props }) => {
  const provider = useQuery({
    queryKey: ['provider', connector.uid],
    queryFn: () => connector.getProvider()
  });

  return (
    <WalletOptionCard iconSrc={ICONS[connector.id]} {...props} disabled={!provider.isSuccess || props.disabled}>
      {connector.name}
    </WalletOptionCard>
  );
};
