import { Contract, ethers } from 'ethers';
// import { EIP1193Provider } from '@web3-onboard/core';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { NetworkInfo } from '~root/providers/networkInfo.provider';

let contracts: Record<EContractName, Contract> = {} as Record<EContractName, Contract>;

const initGetterContract = ({ provider, network }: { provider: any; network: NetworkInfo })=> {
  const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
  const contractAddress = network.getterContractAddress;
  if (contracts[EContractName.GETTER] && contracts[EContractName.GETTER].address === contractAddress) {
    // console.warn('Getter contract already exists', { abi, contractAddress });
    return;
  }

  if (contractAddress) {
    // console.warn('Creating new getter contract', { abi, contractAddress });
    const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
    contracts[EContractName.GETTER] = new Contract(contractAddress, abi, ethProvider.getSigner());
  } else {
    console.warn('No getter contract address found');
  }
};

const initSetterContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_NETWORK_SETTER.ABI;
  const contractAddress = network.setterContractAddress;
  if (contracts[EContractName.SETTER] && contracts[EContractName.SETTER].address === contractAddress) {
    // console.warn('Setter contract already exists', { abi, contractAddress });
    return;
  }

  if (contractAddress) {
    // console.warn('Creating new setter contract', { abi, contractAddress });
    const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
    contracts[EContractName.SETTER] = new Contract(contractAddress, abi, ethProvider.getSigner());
  } else {
    console.warn('No setter contract address found');
  }
};

const initTokenContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_TOKEN.ABI;
  const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
  const contractAddress = network.tokenAddress;
  if (contracts[EContractName.TOKEN] && contracts[EContractName.TOKEN].address === contractAddress) {
    console.warn('Token contract already exists', { abi, contractAddress });
    return;
  }
  if (contractAddress) {
    // console.warn('Creating new token contract', { abi, contractAddress });
    contracts[EContractName.TOKEN] = new Contract(contractAddress, abi, ethProvider.getSigner());
  } else {
    console.warn('No token contract address found');
  }
};

const initDistributionContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_DISTRIBUTION.ABI;
  const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
  const contractAddress = network.distributionContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.DISTRIBUTION] && contracts[EContractName.DISTRIBUTION].address === contractAddress) {
      console.warn('Distribution contract already exists', { abi, contractAddress });
      return;
    }
    // console.warn('Creating new distribution contract', { abi, contractAddress });
    contracts[EContractName.DISTRIBUTION] = new Contract(contractAddress, abi, ethProvider.getSigner());
  } else {
    console.warn('No distribution contract address found');
  }
};

const getContractByName = (name: EContractName) => contracts[name];

const resetContracts = () => {
  contracts = {} as Record<EContractName, Contract>;
};

/**
 * Crucial to call this only when then network object has been changed
 */
const initContracts = ({ network }: { network: NetworkInfo }) => { // ({ provider, network }: { provider: EIP1193Provider; network: NetworkInfo }) => {
  const provider = new ethers.providers.JsonRpcProvider('http://bn-h-3.stage.bloxinfra.com:8547/');
  initGetterContract({ provider, network });
  initSetterContract({ provider, network });
  initTokenContract({ provider, network });
  initDistributionContract({ provider, network });
};

export {
  initContracts,
  resetContracts,
  getContractByName,
};
