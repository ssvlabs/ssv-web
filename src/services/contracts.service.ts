import { Contract, ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { HOLESKY_NETWORK_ID, NetworkInfo } from '~root/providers/networkInfo.provider';
import { GOERLI_RPC_URL, HOLESKY_RPC_URL } from '~app/common/config/config';

let contracts: Record<EContractName, Contract> = {} as Record<EContractName, Contract>;
let shouldUseRpcUrlFlag = false;

const initGetterContract = ({ provider, network }: { provider: any; network: NetworkInfo })=> {
  const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
  const contractAddress = network.getterContractAddress;
  if (contractAddress) {
    if (contracts[EContractName.GETTER] && contracts[EContractName.GETTER].address === contractAddress) {
      console.warn('Getter contract already exists');
    } else {
      console.warn('Creating new getter contract');
      let ethProvider;
      if (shouldUseRpcUrlFlag) {
        ethProvider = new ethers.providers.JsonRpcProvider(network.networkId === HOLESKY_NETWORK_ID ? HOLESKY_RPC_URL : GOERLI_RPC_URL);
      } else {
        ethProvider = new ethers.providers.Web3Provider(provider, 'any');
      }
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
      let rpcProvider;
      if (shouldUseRpcUrlFlag) {
        rpcProvider = new ethers.providers.JsonRpcProvider(network.networkId === HOLESKY_NETWORK_ID ? HOLESKY_RPC_URL : GOERLI_RPC_URL);
      } else {
        rpcProvider = new ethers.providers.Web3Provider(provider, 'any');
      }
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
const initContracts = ({ provider, network, shouldUseRpcUrl }: { provider: EIP1193Provider | null; network: NetworkInfo; shouldUseRpcUrl: boolean }) => {
  shouldUseRpcUrlFlag = shouldUseRpcUrl;
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
