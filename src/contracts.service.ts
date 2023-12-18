import { EIP1193Provider } from '@web3-onboard/core';
import { Contract, ethers } from 'ethers';
import config from '~app/common/config';

let getterContract: Contract;
let setterContract: Contract;

const initGetterContract = ({ provider }: { provider: EIP1193Provider }): Contract => {
  if (!getterContract) {
    const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
    const contractAddress: string = config.CONTRACTS.SSV_NETWORK_GETTER.ADDRESS;
    console.warn('Creating new getter contract', { abi, contractAddress });
    const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
    getterContract = new Contract(contractAddress, abi, ethProvider.getSigner());
  }
  return getterContract;
};

const initSetterContract = ({ provider }: { provider: EIP1193Provider }): Contract => {
  if (!setterContract) {
    const abi: any = config.CONTRACTS.SSV_NETWORK_SETTER.ABI;
    const contractAddress: string = config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS;
    console.warn({ abi, contractAddress });
    const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
    setterContract = new Contract(contractAddress, abi, ethProvider.getSigner());
  }
  return setterContract;
};

export { initGetterContract, initSetterContract };
