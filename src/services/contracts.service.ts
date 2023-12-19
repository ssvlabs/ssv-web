import { EIP1193Provider } from '@web3-onboard/core';
import { Contract, ethers } from 'ethers';
import config from '~app/common/config';

let getterContract: Contract;
let setterContract: Contract;
let ssvContract: Contract;

const initGetterContract = ({ provider }: { provider: EIP1193Provider })=> {
  const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
  const contractAddress: string = config.CONTRACTS.SSV_NETWORK_GETTER.ADDRESS;
  console.warn('Creating new getter contract', { abi, contractAddress });
  const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
  getterContract = new Contract(contractAddress, abi, ethProvider.getSigner());
};

const getGetterContract = () => getterContract;

const initSetterContract = ({ provider }: { provider: EIP1193Provider }) => {
  const abi: any = config.CONTRACTS.SSV_NETWORK_SETTER.ABI;
  const contractAddress: string = config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS;
  console.warn({ abi, contractAddress });
  const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
  setterContract = new Contract(contractAddress, abi, ethProvider.getSigner());
};

const getSetterContract = () => setterContract;

const initSsvContract = ({ provider }: { provider: EIP1193Provider }) => {
  const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
  ssvContract = new Contract(config.CONTRACTS.SSV_TOKEN.ADDRESS, config.CONTRACTS.SSV_TOKEN.ABI, ethProvider.getSigner());
}

const getSsvContract = () => ssvContract;

export { initGetterContract, initSetterContract, initSsvContract, getGetterContract, getSetterContract, getSsvContract };
