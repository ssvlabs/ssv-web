import { EIP1193Provider } from '@web3-onboard/core';
import { ethers } from 'ethers';

const NON_CONTRACT_WALLET_CODE = '0x'; // any multi signature wallet is actually a contract and its code similar to '0x<some hexadecimal>'

const checkIfWalletIsContract = async ({ provider, walletAddress }: { provider: EIP1193Provider; walletAddress: string }) => {
  const wrapperProvider = new ethers.providers.Web3Provider(provider);
  const res = await wrapperProvider.getCode(walletAddress);
  return res !== NON_CONTRACT_WALLET_CODE;
};

export { checkIfWalletIsContract };
