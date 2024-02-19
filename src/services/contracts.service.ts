import { Contract, ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { NetworkInfo } from '~root/providers/networkInfo.provider';

// const RPC_URL = 'https://late-thrilling-arm.ethereum-holesky.quiknode.pro/b64c32d5e1b1664b4ed2de4faef610d2cf08ed26';
const RPC_URL = 'https://long-rough-season.ethereum-goerli.quiknode.pro/3f90b8bb4aaea263621f2522b6b9ae240c09c7c6';

let contracts: Record<EContractName, Contract> = {} as Record<EContractName, Contract>;

const initGetterContract = ({ provider, network }: { provider: any; network: NetworkInfo })=> {
  const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
  const contractAddress = network.getterContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.GETTER] && contracts[EContractName.GETTER].address === contractAddress) {
      console.warn('Getter contract already exists');
    } else {
      console.warn('Creating new getter contract');
      // const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
      const ethProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
      contracts[EContractName.GETTER] = new Contract(contractAddress, abi, ethProvider);
    }
  } else {
    console.warn('No getter contract address found');
  }
};

const initSetterContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_NETWORK_SETTER.ABI;
  const contractAddress = network.setterContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.SETTER] && contracts[EContractName.SETTER].address === contractAddress) {
      console.warn('Setter contract already exists');
    } else {
      console.warn('Creating new setter contract');
      const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
      contracts[EContractName.SETTER] = new Contract(contractAddress, abi, ethProvider.getSigner());
    }
  } else {
    console.warn('No setter contract address found');
  }
};

const initTokenContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_TOKEN.ABI;
  const contractAddress = network.tokenAddress;
  if (contractAddress) {
    if (contracts[EContractName.TOKEN_GETTER] && contracts[EContractName.TOKEN_GETTER].address === contractAddress) {
      console.warn('Token contract already exists');
    } else {
      console.warn('Creating new token contract');
      const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
      const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
      contracts[EContractName.TOKEN_GETTER] = new Contract(contractAddress, abi, rpcProvider);
      contracts[EContractName.TOKEN_SETTER] = new Contract(contractAddress, abi, ethProvider.getSigner());
    }
  } else {
    console.warn('No token contract address found');
  }
};

const initDistributionContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_DISTRIBUTION.ABI;
  const contractAddress = network.distributionContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.DISTRIBUTION] && contracts[EContractName.DISTRIBUTION].address === contractAddress) {
      console.warn('Distribution contract already exists', { abi, contractAddress });
    } else {
      console.warn('Creating new distribution contract');
      const ethProvider = new ethers.providers.Web3Provider(provider, 'any');
      contracts[EContractName.DISTRIBUTION] = new Contract(contractAddress, abi, ethProvider.getSigner());
    }
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
const initContracts = ({ provider, network }: { provider: EIP1193Provider | null; network: NetworkInfo; }) => {
  // const resolvedProvider = // provider ? new ethers.providers.Web3Provider(provider, 'any') : new ethers.providers.JsonRpcProvider(RPC_URL);
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
