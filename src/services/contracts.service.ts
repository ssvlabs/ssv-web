import { Contract, ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { NetworkInfo } from '~root/providers/networkInfo.provider';

let contracts: Record<EContractName, Contract> = {} as Record<EContractName, Contract>;

const initGetterContract = ({ provider, network }: { provider: any; network: NetworkInfo })=> {
  const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
  const contractAddress = network.getterContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.GETTER] && contracts[EContractName.GETTER].address === contractAddress) {
      console.warn('Getter contract already exists');
    } else {
      console.warn('Creating new getter contract');
      contracts[EContractName.GETTER] = new Contract(contractAddress, abi, provider);
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
      contracts[EContractName.SETTER] = new Contract(contractAddress, abi, provider);
    }
  } else {
    console.warn('No setter contract address found');
  }
};

const initTokenContract = ({ provider, network }: { provider: any; network: NetworkInfo }) => {
  const abi: any = config.CONTRACTS.SSV_TOKEN.ABI;
  const contractAddress = network.tokenAddress;
  if (contractAddress) {
    if (contracts[EContractName.TOKEN] && contracts[EContractName.TOKEN].address === contractAddress) {
      console.warn('Token contract already exists');
    } else {
      console.warn('Creating new token contract');
      console.warn('Token contract address ', contractAddress);
      try {
        contracts[EContractName.TOKEN] = new Contract(contractAddress, abi, provider);
      } catch (e) {
        console.warn('Creating new token contract error', e);
      }
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
      contracts[EContractName.DISTRIBUTION] = new Contract(contractAddress, abi, provider);
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
const initContracts = ({ provider, network }: { provider: EIP1193Provider | null; network: NetworkInfo }) => {
  const resolvedProvider = provider ? new ethers.providers.Web3Provider(provider) : new ethers.providers.JsonRpcProvider('https://late-thrilling-arm.ethereum-holesky.quiknode.pro/b64c32d5e1b1664b4ed2de4faef610d2cf08ed26/');
  initGetterContract({ provider: resolvedProvider, network });
  initSetterContract({ provider: resolvedProvider, network });
  initTokenContract({ provider: resolvedProvider, network });
  initDistributionContract({ provider: resolvedProvider, network });
};

export {
  initContracts,
  resetContracts,
  getContractByName,
};
