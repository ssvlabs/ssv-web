import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import { getValidator as getValidatorServiceCall, clustersByOwnerAddress } from '~root/services/validator.service';
import { getOperatorsByOwnerAddress } from '~root/services/operator.service';
import { extendClusterEntity } from '~root/services/cluster.service';
import { ProcessStore, SsvStore } from '~app/common/stores/applications/SsvWeb/index';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { fromWei } from '~root/services/conversions.service';
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

  // BEACONCHAIN
  beaconChaBalances: any = {};
  beaconChaPerformances: any = {};

  constructor() {
    super();

    makeObservable(this, {
      getValidator: action.bound,
      beaconChaBalances: observable,
      getOperatorRevenue: action.bound,
      ownerAddressOperators: observable,
      getOperatorsRevenue: action.bound,
      beaconChaPerformances: observable,
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
    this.ownerAddressOperators = await this.getOperatorsRevenue(response.operators);
  }

  async getOperatorRevenue(operator: any) {
    try {
      const contract = getContractByName(EContractName.GETTER);
      const response = await contract.totalEarningsOf(operator.id);
      operator.revenue = fromWei(response.toString());
    } catch (e: any) {
      operator.revenue = 0;
    }
    return operator;
  }

  async getOperatorsRevenue(operatorsList: any) {
    return Promise.all(operatorsList.map((operator: any) => this.getOperatorRevenue(operator)));
  }

  async getValidator(publicKey: string): Promise<any> {
    const validator = await getValidatorServiceCall(publicKey);
    const validatorPublicKey = `0x${validator.public_key}`;
    const validatorBalance = formatNumberFromBeaconcha(this.beaconChaBalances[validatorPublicKey]?.balance);
    const performance7days = this.beaconChaPerformances[validator.public_key] ? formatNumberFromBeaconcha(this.beaconChaPerformances[validator.public_key].performance7d) : 0;
    // @ts-ignore
    const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
    return {
      apr,
      status: validator.status,
      balance: validatorBalance,
      operators: validator.operators,
      public_key: validator.public_key,
    };
  }

  async getOwnerAddressClusters({ forcePage, forcePerPage }: { forcePage?: number, forcePerPage?: number }): Promise<any[]> {
    const ssvStore: SsvStore = this.getStore('SSV');
    const processStore: ProcessStore = this.getStore('Process');
    const process: SingleCluster = processStore.getProcess;
    const accountAddress = store.getState().walletState.accountAddress;
    if (!accountAddress) return [];
    const { page, per_page } = this.ownerAddressClustersPagination;
    const query = `${accountAddress}?page=${forcePage ?? page}&perPage=${forcePerPage ?? per_page}`;
    const response = await clustersByOwnerAddress(query);
    if (!response) return [];
    this.ownerAddressClustersPagination = response.pagination;
    this.ownerAddressClusters = await Promise.all(response.clusters.map((cluster: any) => extendClusterEntity(cluster, accountAddress, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral))) || [];
    this.ownerAddressClusters = this.ownerAddressClusters.filter((cluster: any) => cluster.validatorCount > 0 || !cluster.isLiquidated);
    if (process && process.processName === 'single_cluster') {
        const updatedCluster = this.ownerAddressClusters.find((cluster: any) => cluster.id === process.item.id);
        process.item = { ...process.item, ...updatedCluster };
    }
    return this.ownerAddressClusters;
  }

  async refreshOperatorsAndClusters() {
    this.ownerAddressOperatorsPagination = DEFAULT_PAGINATION;
    this.ownerAddressClustersPagination = DEFAULT_PAGINATION;
    await this.getOwnerAddressClusters({});
    await this.getOwnerAddressOperators({});
  }
}

export default MyAccountStore;
