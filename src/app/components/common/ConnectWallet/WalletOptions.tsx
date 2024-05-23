import { useConnect } from 'wagmi';
import { WalletOption } from './WalletOption';

export const WalletOptions = () => {
  const { connectors, connect } = useConnect();
  return (
    <>
      {connectors.map((connector) => (
        <WalletOption key={connector.uid} connector={connector} onClick={() => connect({ connector })} />
      ))}
    </>
  );
};
