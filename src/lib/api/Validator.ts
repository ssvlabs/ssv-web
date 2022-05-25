import axios from 'axios';
import config from '~app/common/config';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';

type GetValidatorsByOwnerAddress = {
    page: number,
    force?: boolean
    perPage: number,
    ownerAddress: string,
};

class Validator {
    validator: any = null;
    validators: any = null;
    pagination: any = null;
    noValidatorsForOwnerAddress: boolean = false;
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

    clearOperatorsCache() {
        this.validator = null;
        this.validators = null;
        this.pagination = null;
        this.noValidatorsForOwnerAddress = false;
    }

    async getValidatorsByOwnerAddress(props: GetValidatorsByOwnerAddress): Promise<any> {
        const { page, perPage, ownerAddress, force } = props;
        if (!force && this.pagination?.page === page && this.pagination.per_page === perPage) {
            return { pagination: this.pagination, validators: this.validators };
        }
        try {
            const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators?ownedBy=${ownerAddress}&page=${page}&perPage=${perPage}`;
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
                this.noValidatorsForOwnerAddress = false;
                apiResponseData.validators = detailedValidators;
            } else {
                this.noValidatorsForOwnerAddress = true;
            }

            this.validators = apiResponseData.validators;
            this.pagination = apiResponseData.pagination;

            return apiResponseData;
        } catch (e) {
            this.noValidatorsForOwnerAddress = true;
            return { validators: [], pagination: {} };
        }
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

    async getValidator(publicKey: string, checkExistence?: boolean) {
        try {
            if (this.validator?.public_key === publicKey) return this.validator;
            const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/prater/${publicKey.replace('0x', '')}?performances=24hours&withFee=true`;
            const response: any = (await axios.get(url)).data;
            if (checkExistence) {
                return response;
            }
            const balance = await this.getValidatorsBalances([publicKey]);
            const detailedValidator = await this.buildValidatorStructure(response?.public_key, balance[0]);
            const validator = Object.create(detailedValidator);
            validator.operators = response?.operators;
            this.validator = validator;
            return validator;
        } catch (e) {
            return null;
        }
    }

    buildValidatorStructure = async (validator: string, data: any) => {
        if (!data) return { public_key: validator, status: 'inactive', balance: '0', apr: '0' };
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
        try {
            const performance = (await axios.get(url)).data;
            const balance = formatNumberFromBeaconcha(data.balance);
            const performance7days = performance.data ? formatNumberFromBeaconcha(performance.data.performance7d) : 0;
            // @ts-ignore
            const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
            const status = data.status === 'active_online' ? 'active' : 'inactive';
            const public_key = data.pubkey;
            return { public_key, status, balance, apr };
        } catch (e: any) {
            return { public_key: data.pubkey, status: data.status, balance: 0, apr: 0 };
        }
    };
}

export default Validator;