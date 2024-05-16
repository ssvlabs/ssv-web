import { ethers } from 'ethers';

const NON_CONTRACT_WALLET_CODE = '0x'; // any multi signature wallet is actually a contract and its code similar to '0x<some hexadecimal>'

const checkIfWalletIsContract = async ({ provider, walletAddress }: { provider: ethers.providers.JsonRpcProvider; walletAddress: string }) => {
  const res = await provider.getCode(walletAddress);
  return res !== NON_CONTRACT_WALLET_CODE;
};

export { checkIfWalletIsContract };
