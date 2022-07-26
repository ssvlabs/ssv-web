import { action, observable } from 'mobx';
import Operator from '~lib/api/Operator';
// import Validator from '~lib/api/Validator';
import ApiParams from '~lib/api/ApiParams';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import Validator from '~lib/api/Validator';
import SSVStore from '~app/common/stores/applications/SsvWeb/SSV.store';

class MyAccountStore extends BaseStore {
    // GLOBAL
    @observable forceBigList: boolean = false;
    @observable operatorsInterval: any = null;
    @observable validatorsInterval: any = null;

    // OPERATOR
    @observable ownerAddressOperators: any = [];
    @observable ownerAddressOperatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

    // VALIDATOR
    @observable ownerAddressValidators: any = [];
    @observable ownerAddressValidatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

    @action.bound
    clearIntervals() {
        clearInterval(this.operatorsInterval);
        clearInterval(this.validatorsInterval);
        this.ownerAddressOperators = [];
        this.ownerAddressValidators = [];
        this.ownerAddressOperatorsPagination = ApiParams.DEFAULT_PAGINATION;
        this.ownerAddressValidatorsPagination = ApiParams.DEFAULT_PAGINATION;
    }

    @action.bound
    setIntervals() {
        this.validatorsInterval = setInterval(() => {
            this.getOwnerAddressValidators({});
        }, 6000);

        this.operatorsInterval = setInterval(() => {
            this.getOwnerAddressOperators({});
        }, 6000);
    }

    @action.bound
    async getOwnerAddressOperators({ forcePage, forcePerPage } : { forcePage?: number, forcePerPage?: number }): Promise<void> {
        const { page, perPage } = this.ownerAddressOperatorsPagination;
        const walletStore: WalletStore = this.getStore('Wallet');
        if (!walletStore.accountAddress) return;
        const response = await Operator.getInstance().getOperatorsByOwnerAddress(forcePage ?? page, this.forceBigList ? 10 : forcePerPage ?? perPage, walletStore.accountAddress);
        response.pagination.perPage = response.pagination.per_page;
        this.ownerAddressOperatorsPagination = response.pagination;
        this.ownerAddressOperators = await this.getOperatorsRevenue(response.operators);
    }

    @action.bound
    async getOperatorRevenue(operator: any) {
        const operatorStore: OperatorStore = this.getStore('Operator');
        const revenue = await operatorStore.getOperatorRevenue(operator.id);
        // eslint-disable-next-line no-param-reassign
        operator.revenue = revenue;
        return operator;
    }

    @action.bound
    async getOperatorsRevenue(operatorsList: any) {
        return Promise.all(operatorsList.map((operator: any) => this.getOperatorRevenue(operator)));
    }

    @action.bound
    async getOwnerAddressValidators({ forcePage, forcePerPage } : { forcePage?: number, forcePerPage?: number }): Promise<void> {
        const ssvStore: SSVStore = this.getStore('SSV');
        const walletStore: WalletStore = this.getStore('Wallet');
        const { page, perPage } = this.ownerAddressValidatorsPagination;
        if (!walletStore.accountAddress) return;
        const response = await Validator.getInstance().getValidatorsByOwnerAddress(
            {
                page: forcePage ?? page,
                ownerAddress: walletStore.accountAddress,
                perPage: this.forceBigList ? 10 : (forcePerPage ?? perPage),
            },
        );
        if (response?.validators?.length > 0) {
            ssvStore.userState = 'validator';
            response.pagination.perPage = response.pagination.per_page;
            this.ownerAddressValidatorsPagination = response.pagination;
            this.ownerAddressValidators = response.validators;
        }
    }
}

export default MyAccountStore;
