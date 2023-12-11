import Decimal from 'decimal.js';
import { keccak256 } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { action, makeObservable } from 'mobx';
import config from '~app/common/config';
import { getClusterData } from '~lib/api/validator.service';
import BaseStore from '~app/common/stores/BaseStore';
import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';

const annotations = {
  getClusterData: action.bound,
  getClusterHash: action.bound,
  getClusterRunWay: action.bound,
  getClusterBalance: action.bound,
};

class ClusterStore extends BaseStore {

  constructor() {
    super();
    makeObservable(this, annotations);
  }

  getSortedOperatorsIds(operators: any[]) {
    if (typeof operators[0] === 'number') return operators.map(Number).sort((a: number, b: number) => a - b);
    return operators.map(operator => operator.id).map(Number).sort((a: number, b: number) => a - b);
  }

  getClusterHash(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const ownerAddress: string = walletStore.accountAddress;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    return keccak256(walletStore.web3.utils.encodePacked(ownerAddress, ...operatorsIds));
  }

  async getClusterBalance(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    try {
      const balance = await contract.methods.getBalance(walletStore.accountAddress, operatorsIds, clusterData).call();
      return balance;
    } catch (e) {
      return 0;
    }
  }

  getClusterNewBurnRate(cluster: any, newAmountOfValidators: number) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const ssvStore: SsvStore = this.getStore('SSV');
    const operatorsFeePerYear = cluster.operators.reduce((acc: number, operator: IOperator) => Number(acc) + Number(formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(operator.fee)))), [0]);
    const operatorsFeePerBlock = new Decimal(operatorsFeePerYear).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();
    const networkFeePerBlock = new Decimal(ssvStore.networkFee).toFixed().toString();
    const clusterBurnRate =  parseFloat(operatorsFeePerBlock) + parseFloat(networkFeePerBlock);
    return clusterBurnRate * newAmountOfValidators;
  }

  async isClusterLiquidated(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData: any = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    try {
      const isLiquidated = await contract.methods.isLiquidated(walletStore.accountAddress, operatorsIds, clusterData).call();
      return isLiquidated;
    } catch (e) {
      return false;
    }
  }

  async getClusterBurnRate(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const contract: Contract = walletStore.getterContract;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const clusterData = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    try {
      const burnRate = await contract.methods.getBurnRate(walletStore.accountAddress, operatorsIds, clusterData).call();
      return burnRate;
    } catch (e) {
      return 0;
    }
  }

  getClusterRunWay(cluster: any) {
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const liquidationCollateral = ssvStore.liquidationCollateralPeriod / config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
    const burnRatePerDay = walletStore.fromWei(cluster.burnRate) * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
    let liquidationCollateralCost = burnRatePerDay * liquidationCollateral;
    if (liquidationCollateralCost < ssvStore.minimumLiquidationCollateral) {
      liquidationCollateralCost = ssvStore.minimumLiquidationCollateral;
    }
    return Math.max((walletStore.fromWei(cluster.balance) - liquidationCollateralCost) / burnRatePerDay, 0);
  }

  async getClusterData(clusterHash: string, fullData = false) {
    try {
      const response = await getClusterData(clusterHash);
      const clusterData = response.cluster;
      if (clusterData === null) {
        return {
          validatorCount: 0,
          networkFeeIndex: 0,
          index: 0,
          balance: 0,
          active: true,
        };
      } else if (fullData) {
        const isLiquidated: boolean = await this.isClusterLiquidated(Object.values(clusterData.operators));
        const burnRate: string = await this.getClusterBurnRate(Object.values(clusterData.operators));
        const runWay: number = this.getClusterRunWay({ ...clusterData, burnRate });
        return { ...clusterData, isLiquidated, runWay, burnRate };
      } else {
        return  {
          validatorCount: clusterData.validatorCount,
          networkFeeIndex: clusterData.networkFeeIndex,
          index: clusterData.index,
          balance: clusterData.balance,
          active: clusterData.active,
        };
      }
    } catch (e) {
      return null;
    }
  }

  async extendClusterEntity(cluster: any) {
    const clusterData = await this.getClusterData(this.getClusterHash(cluster.operators));
    const newBalance = await this.getClusterBalance(cluster.operators, clusterData);
    const burnRate = await this.getClusterBurnRate(cluster.operators, clusterData);
    const isLiquidated = await this.isClusterLiquidated(cluster.operators, clusterData);
    const runWay = this.getClusterRunWay({
      ...cluster,
      burnRate: burnRate,
      balance: newBalance,
    });
    return {
      ...cluster,
      runWay,
      burnRate,
      balance: newBalance,
      isLiquidated,
    };
  }
}

export default ClusterStore;
