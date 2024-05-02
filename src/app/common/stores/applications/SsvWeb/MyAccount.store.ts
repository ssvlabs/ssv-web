import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { clustersByOwnerAddress } from '~root/services/validator.service';
import { getOperatorsByOwnerAddress } from '~root/services/operator.service';
import { extendClusterEntity } from '~root/services/cluster.service';
import { ProcessStore, SsvStore } from '~app/common/stores/applications/SsvWeb';
import { DEFAULT_PAGINATION } from '~app/common/config/config';
import { IOperator } from '~app/model/operator.model';
import { store } from '~app/store';
import { SingleCluster } from '~app/model/processes.model';

class MyAccountStore extends BaseStore {
  // OPERATOR
  ownerAddressOperators: IOperator[] = [];
  ownerAddressOperatorsPagination = DEFAULT_PAGINATION;

  // VALIDATOR
  ownerAddressClusters: any = [];
  ownerAddressClustersPagination = DEFAULT_PAGINATION;

  constructor() {
    super();

    makeObservable(this, {
      ownerAddressOperators: observable,
      ownerAddressClusters: observable,
      getOwnerAddressClusters: action.bound,
      getOwnerAddressOperators: action.bound,
      ownerAddressOperatorsPagination: observable,
      ownerAddressClustersPagination: observable,
      refreshOperatorsAndClusters: action.bound,
    });
  }

  async getOwnerAddressOperators({ forcePage, forcePerPage }: { forcePage?: number, forcePerPage?: number }): Promise<void> {
    const { page, per_page } = this.ownerAddressOperatorsPagination;
    const accountAddress = store.getState().walletState.accountAddress;
    if (!accountAddress) return;
    const response = await getOperatorsByOwnerAddress(forcePage ?? page, forcePerPage ?? per_page, accountAddress);
    this.ownerAddressOperatorsPagination = response.pagination;
    this.ownerAddressOperators = response.operators;
  }

  async getOwnerAddressClusters({ forcePage, forcePerPage }: { forcePage?: number, forcePerPage?: number }): Promise<any[]> {
    const ssvStore: SsvStore = this.getStore('SSV');
    const processStore: ProcessStore = this.getStore('Process');
    const process: SingleCluster = processStore?.getProcess;
    const accountAddress = store.getState().walletState.accountAddress;
    if (!accountAddress) return [];
    const { page, per_page } = this.ownerAddressClustersPagination;
    const query = `${accountAddress}?page=${forcePage ?? page}&perPage=${forcePerPage ?? per_page}`;
    const response = await clustersByOwnerAddress(query);
    if (!response) return [];
    this.ownerAddressClustersPagination = response.pagination;
    this.ownerAddressClusters = await Promise.all(response.clusters.map((cluster: any) => extendClusterEntity(cluster, accountAddress, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral)));
    this.ownerAddressClusters = this.ownerAddressClusters.filter((cluster: any) => !(cluster.validatorCount === 0 && cluster.isLiquidated) && !(cluster.validatorCount === 0 && !Number(cluster.balance)));
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

export default MyAccountStore;
