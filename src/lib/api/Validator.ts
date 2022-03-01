import config from '~app/common/config';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import ApiRequest, { RequestData } from '~lib/utils/ApiRequest';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';

class Validator {
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

    async getValidatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string) {
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const requestInfo: RequestData = {
            url: operatorsEndpointUrl,
            method: 'GET',
            headers: [
                { name: 'content-type', value: 'application/json' },
                { name: 'accept', value: 'application/json' },
            ],
        };
        const response: any = await new ApiRequest(requestInfo).sendRequest();
        if (response.validators.length) {
            const validatorsOwnerAddresses = response.validators.map((v: { public_key: string; }) => v.public_key);
            const balances = await this.getValidatorsBalances(validatorsOwnerAddresses);
            const hashedBalances = balances.reduce((obj: any, item: { pubkey: any; value: any; }) => ({ ...obj, [item.pubkey]: item }), {});
            const detailedValidators = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const validator of response.validators) {
                const validatorPublicKey = `0x${validator.public_key}`;
                const validatorBalance = hashedBalances[validatorPublicKey];
                // eslint-disable-next-line no-await-in-loop
                const detailedValidator = await this.buildValidatorStructure(validatorPublicKey, validatorBalance);
                detailedValidators.push(detailedValidator);
            }
            response.validators = detailedValidators;
        }
        return response;
    }

    async getValidatorsBalances(publicKeys: string[]) {
        const balanceUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
        const response: any = await new ApiRequest({ url: balanceUrl, method: 'GET' }).sendRequest();
        if (!Array.isArray(response.data)) {
            response.data = [response.data];
        }
        return response.data;
    }

    buildValidatorStructure = async (validator: string, data: any) => {
        if (!data) return { public_key: validator, status: 'inactive', balance: '0', apr: '0' };
        const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
        return new ApiRequest({ url, method: 'GET' }).sendRequest().then((performance: any) => {
            const balance = formatNumberFromBeaconcha(data.balance);
            const performance7days = performance.data ? formatNumberFromBeaconcha(performance.data.performance7d) : 0;
            // @ts-ignore
            const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
            const status = data.status === 'active_online' ? 'active' : 'inactive';
            const public_key = data.pubkey;
            return { public_key, status, balance, apr };
        });
    };
}

export default Validator;