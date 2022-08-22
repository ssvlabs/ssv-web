import axios from 'axios';
import { action, observable } from 'mobx';
import Operator from '~lib/api/Operator';
// import Validator from '~lib/api/Validator';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SSVStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';

const INTERVAL_TIME = 12000;

class MyAccountStore extends BaseStore {
    // GLOBAL
    @observable forceBigList: boolean = false;
    @observable operatorsInterval: any = null;
    @observable validatorsInterval: any = null;
    @observable lastUpdateOperators: number | undefined;
    @observable lastUpdateValidators: number | undefined;

    // OPERATOR
    @observable ownerAddressOperators: any = [];
    @observable ownerAddressOperatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

    // VALIDATOR
    @observable ownerAddressValidators: any = [];
    @observable ownerAddressValidatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

    // BEACONCHAIN
    @observable beaconChaBalances: any = {};
    @observable beaconChaPerformances: any = {};

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
            // @ts-ignore
            const diffTime = Date.now() - this.lastUpdateValidators;
            if (Math.floor((diffTime / 1000) % 60) < INTERVAL_TIME) return;
            this.getOwnerAddressValidators({});
        }, INTERVAL_TIME);

        this.operatorsInterval = setInterval(() => {
            // @ts-ignore
            const diffTime = Date.now() - this.lastUpdateOperators;
            if (Math.floor((diffTime / 1000) % 60) < INTERVAL_TIME) return;
            this.getOwnerAddressOperators({});
        }, INTERVAL_TIME);
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
        this.lastUpdateOperators = Date.now();
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
    async getValidator(publicKey: string): Promise<any> {
        const validator = await Validator.getInstance().getValidator(publicKey);
        const validatorPublicKey = `0x${validator.public_key}`;
        const validatorBalance = formatNumberFromBeaconcha(this.beaconChaBalances[validatorPublicKey]?.balance);
        // eslint-disable-next-line no-await-in-loop
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

    @action.bound
    async getOwnerAddressValidators({ forcePage, forcePerPage, reFetchBeaconData } : { forcePage?: number, forcePerPage?: number, reFetchBeaconData?: boolean }): Promise<void> {
        const walletStore: WalletStore = this.getStore('Wallet');
        if (!walletStore.accountAddress) return;
        const ssvStore: SSVStore = this.getStore('SSV');
        const { page, perPage } = this.ownerAddressValidatorsPagination;
        const query = `?search=${walletStore.accountAddress}&ordering=public_key:asc&page=${forcePage ?? page}&perPage=${this.forceBigList ? 10 : (forcePerPage ?? perPage)}&operators=true`;
        const response = await Validator.getInstance().validatorsByOwnerAddress(query);

        if (reFetchBeaconData) {
            const validatorsPublicKey = response.validators.map(({ public_key }: { public_key: string }) => public_key);
            await this.getValidatorsBalances(validatorsPublicKey);
            // eslint-disable-next-line no-restricted-syntax
            for (const publicKey of validatorsPublicKey) {
                // eslint-disable-next-line no-await-in-loop
                await this.getValidatorPerformance(publicKey);
            }
        }
        const extendedValidators = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const validator of response.validators) {
            const validatorPublicKey = `0x${validator.public_key}`;
            const validatorBalance = formatNumberFromBeaconcha(this.beaconChaBalances[validatorPublicKey]?.balance);
            // eslint-disable-next-line no-await-in-loop
            const performance7days = this.beaconChaPerformances[validator.public_key] ? formatNumberFromBeaconcha(this.beaconChaPerformances[validator.public_key].performance7d) : 0;
            // @ts-ignore
            const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
            extendedValidators.push({ public_key: validator.public_key, status: validator.status, balance: validatorBalance, apr });
        }

        if (response?.validators?.length > 0) {
            ssvStore.userState = 'validator';
            response.pagination.perPage = response.pagination.per_page;
            this.ownerAddressValidatorsPagination = response.pagination;
            this.ownerAddressValidators = extendedValidators;
            this.lastUpdateValidators = Date.now();
        }
    }

    async getValidatorsBalances(publicKeys: string[]): Promise<void> {
        try {
            const balanceUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
            const response: any = (await axios.get(balanceUrl, { timeout: 2000 })).data;
            let responseData = response.data;
            if (!Array.isArray(responseData)) {
                responseData = [responseData];
            }
            this.beaconChaBalances = responseData.reduce((obj: any, item: { pubkey: any; value: any; }) => ({ ...obj, [item.pubkey]: item }), {});
        } catch (e) {
            console.log('[ERROR]: fetch balances from beacon failed');
        }
    }

    getValidatorPerformance = async (publicKey: string): Promise<void> => {
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKey}/performance`;
        try {
            const performance = (await axios.get(url)).data;
            this.beaconChaPerformances[publicKey] = performance.data;
        } catch (e: any) {
            console.log('[ERROR]: fetch performances from beacon failed');
        }
    };
}

export default MyAccountStore;
