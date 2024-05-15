import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

export const ConnectWallet: FC = () => {
  // return <Button variant="outline">Connect Wallet</Button>;
  // return <WalletOptions />;

  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('hello');
        }, 1000);
      });
    }
  });
  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>Error</div>;

  return <div>Connect</div>;
};
