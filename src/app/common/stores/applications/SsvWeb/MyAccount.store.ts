import { action, makeObservable, observable } from 'mobx';
import { DEFAULT_PAGINATION } from '~app/common/config/config';
import { IOperator } from '~app/model/operator.model';
import { SingleCluster } from '~app/model/processes.model';
import { store } from '~app/store';
import { extendClusterEntity } from '~root/services/cluster.service';
import { getOperatorsByOwnerAddress } from '~root/services/operator.service';
import { clustersByOwnerAddress } from '~root/services/validator.service';
import { processStore } from './Process.store';
import { ssvStore } from './SSV.store';

class MyAccountStore {
  // OPERATOR
  ownerAddressOperators: IOperator[] = [];
  ownerAddressOperatorsPagination = DEFAULT_PAGINATION;

  // VALIDATOR
  ownerAddressClusters: any = [];
  ownerAddressClustersPagination = DEFAULT_PAGINATION;

  constructor() {
    makeObservable(this, {
      ownerAddressOperators: observable,
      ownerAddressClusters: observable,
      getOwnerAddressClusters: action.bound,
      getOwnerAddressOperators: action.bound,
      ownerAddressOperatorsPagination: observable,
      ownerAddressClustersPagination: observable,
      refreshOperatorsAndClusters: action.bound
    });
  }

  async getOwnerAddressOperators({ forcePage, forcePerPage }: { forcePage?: number; forcePerPage?: number }): Promise<void> {
    const { page, per_page } = this.ownerAddressOperatorsPagination;
    const accountAddress = store.getState().walletState.accountAddress;
    if (!accountAddress) return;
    const response = await getOperatorsByOwnerAddress(forcePage ?? page, forcePerPage ?? per_page, accountAddress);
    this.ownerAddressOperatorsPagination = response.pagination;
    this.ownerAddressOperators = response.operators;
  }

  async getOwnerAddressClusters({ forcePage, forcePerPage }: { forcePage?: number; forcePerPage?: number }): Promise<any[]> {
    const process: SingleCluster = processStore?.getProcess;
    const accountAddress = store.getState().walletState.accountAddress;
    if (!accountAddress) return [];
    const { page, per_page } = this.ownerAddressClustersPagination;
    const query = `${accountAddress}?page=${forcePage ?? page}&perPage=${forcePerPage ?? per_page}`;
    const response = await clustersByOwnerAddress(query);
    if (!response) return [];
    this.ownerAddressClustersPagination = response.pagination;
    this.ownerAddressClusters = await Promise.all(
      response.clusters.map((cluster: any) => extendClusterEntity(cluster, accountAddress, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral))
    );
    this.ownerAddressClusters = this.ownerAddressClusters.filter((cluster: any) => cluster.validatorCount > 0 || !cluster.isLiquidated);
    if (process && process.processName === 'single_cluster') {
      const updatedCluster = this.ownerAddressClusters.find((cluster: any) => cluster.id === process.item.id);
      process.item = { ...process.item, ...updatedCluster };
    }
    return this.ownerAddressClusters;
  }

  async refreshOperatorsAndClusters() {
    await this.getOwnerAddressClusters({});
    await this.getOwnerAddressOperators({});
  }
}

export const myAccountStore = new MyAccountStore();
export default MyAccountStore;
