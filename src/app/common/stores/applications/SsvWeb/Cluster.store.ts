import { keccak256 } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { action, makeObservable } from 'mobx';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
// import { propertyCostByPeriod } from '~lib/utils/numbers';

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
    return operators.map(operator => operator.id).sort();
  }

  getClusterHash(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const ownerAddress: string = walletStore.accountAddress;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    return keccak256(walletStore.web3.utils.encodePacked(ownerAddress, ...operatorsIds));
  }
  
  async getClusterBalance(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData = await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    return contract.methods.getBalance(walletStore.accountAddress, operatorsIds, clusterData).call();
  }

  async isClusterLiquidated(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData = await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    return contract.methods.isLiquidated(walletStore.accountAddress, operatorsIds, clusterData).call();
  }

  async getClusterBurnRate(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const contract: Contract = walletStore.getterContract;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    return contract.methods.getClusterBurnRate(operatorsIds).call();
  }

  getClusterRunWay(cluster: any) {
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const liquidationCollateral = cluster.burnRate * ssvStore.liquidationCollateralPeriod;
    return (walletStore.fromWei(cluster.balance) - walletStore.fromWei(String(liquidationCollateral))) / (walletStore.fromWei(cluster.burnRate) * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY);
  }

  async getClusterData(clusterHash: string) {
    try {
      const response = await Validator.getInstance().getClusterData(clusterHash);
      const clusterData = response.cluster;
      return {
        validatorCount: clusterData.validatorCount,
        networkFee: clusterData.networkFee,
        networkFeeIndex: clusterData.networkFeeIndex,
        index: clusterData.index,
        balance: clusterData.balance,
        disabled: clusterData.disabled,
      };
    } catch (e) {
      return null;
    }
  }
}

export default ClusterStore;
