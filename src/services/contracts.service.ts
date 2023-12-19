import { EIP1193Provider } from '@web3-onboard/core';
import { Contract, ethers } from 'ethers';
import config from '~app/common/config';
import { fromWei } from '~root/services/conversions.service';

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
};

const getSsvContract = () => ssvContract;

const getNetworkFees = async () => {
  const contract = getGetterContract();
  console.warn('🔴 getNetworkFees2 1');

  let networkFee = 0;
  let liquidationCollateralPeriod = 0;
  let minimumLiquidationCollateral = 0;

  if (networkFee === 0) {
    networkFee = fromWei(await contract.getNetworkFee().catch((e: any) => console.warn('🔴 getNetworkFees2 2 error', e)));
  } else {
    console.warn('🔴 networkFee2:', networkFee);
  }

  if (liquidationCollateralPeriod === 0) {
    liquidationCollateralPeriod = Number(await contract.getLiquidationThresholdPeriod());
  } else {
    console.warn('🔴 liquidationCollateralPeriod2:', liquidationCollateralPeriod);
  }

  console.warn('🔴 getNetworkFees2 3');
  if (minimumLiquidationCollateral === 0) {
    minimumLiquidationCollateral = await contract.getMinimumLiquidationCollateral();
    minimumLiquidationCollateral = fromWei(minimumLiquidationCollateral);
  } else {
    console.warn('🔴 minimumLiquidationCollateral2:', minimumLiquidationCollateral);
  }
  console.warn('🔴 getNetworkFees2 4');

  const result = {
    networkFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
  };
  console.warn(result);
  return result;
};

export {
  initGetterContract,
  initSetterContract,
  initSsvContract,
  getGetterContract,
  getSetterContract,
  getSsvContract,
  getNetworkFees,
};
