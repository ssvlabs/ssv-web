import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { Connector } from 'wagmi';

type Props = {
  connector: Connector;
  onClick: () => void;
};
export const WalletOption: FC<Props> = ({ connector, ...props }) => {
  const provider = useQuery({
    queryKey: ['provider', connector.uid],
    queryFn: () => connector.getProvider()
  });

  return (
    <button disabled={!provider.isSuccess} {...props}>
      {connector.name}
    </button>
  );
};
