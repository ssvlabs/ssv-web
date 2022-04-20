import axios from 'axios';
import config from '~app/common/config';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';

class Validator {
    validator: any = null;
    validators: any = null;
    pagination: any = null;
    private static instance: Validator;
    private readonly baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator(config.links.EXPLORER_CENTER);
        }
        return Validator.instance;
    }

    static get NETWORK() {
        return 'prater';
    }

    async getValidatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string, force?: boolean) {
        if (!force && this.pagination?.page === page && this.pagination.per_page === perPage) {
            return { pagination: this.pagination, validators: this.validators };
        }
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const response: any = await axios.get(operatorsEndpointUrl);
        const apiResponseData = response.data;
        if (apiResponseData.validators?.length) {
            const validatorsOwnerAddresses = apiResponseData.validators.map((v: { public_key: string; }) => v.public_key);
            const balances = await this.getValidatorsBalances(validatorsOwnerAddresses);
            const hashedBalances = balances.reduce((obj: any, item: { pubkey: any; value: any; }) => ({ ...obj, [item.pubkey]: item }), {});
            const detailedValidators = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const validator of apiResponseData.validators) {
                const validatorPublicKey = `0x${validator.public_key}`;
                const validatorBalance = hashedBalances[validatorPublicKey];
                // eslint-disable-next-line no-await-in-loop
                const detailedValidator = await this.buildValidatorStructure(validatorPublicKey, validatorBalance);
                detailedValidators.push(detailedValidator);
            }
            apiResponseData.validators = detailedValidators;
        }

        this.validators = apiResponseData.validators;
        this.pagination = apiResponseData.pagination;

        return apiResponseData;
    }

    async getValidatorsBalances(publicKeys: string[]) {
        try {
            const balanceUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
            const response: any = await axios.get(balanceUrl);
            const responseData = response.data;
            if (!Array.isArray(responseData.data)) {
                responseData.data = [responseData.data];
            }
            return responseData.data;
        } catch (e) {
            return [];
        }
    }

    async getValidator(publicKey: string) {
        try {
            if (this.validator?.public_key === publicKey) return this.validator;
            const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/prater/${publicKey.replace('0x', '')}?performances=24hours`;
            const response: any = await axios.get(url);
            const balance = await this.getValidatorsBalances([publicKey]);
            const detailedValidator = await this.buildValidatorStructure(response, balance[0]);
            const validator = Object.create(detailedValidator);
            validator.operators = response?.data?.operators;
            return validator;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    buildValidatorStructure = async (validator: string, data: any) => {
        if (!data) return { public_key: validator, status: 'inactive', balance: '0', apr: '0' };
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
        const performance = (await axios.get(url)).data;
        const balance = formatNumberFromBeaconcha(data.balance);
        const performance7days = performance.data ? formatNumberFromBeaconcha(performance.data.performance7d) : 0;
        // @ts-ignore
        const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
        const status = data.status === 'active_online' ? 'active' : 'inactive';
        const public_key = data.pubkey;
        return { public_key, status, balance, apr };
    };
}

export default Validator;