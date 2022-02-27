import config from '~app/common/config';
import { shuffle, group } from '~lib/utils/arrays';
import ApiRequest, { RequestData } from '~lib/utils/ApiRequest';

class Operator {
    private static instance: Operator;
    private readonly baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    static getInstance(): Operator {
        if (!Operator.instance) {
            Operator.instance = new Operator(config.links.EXPLORER_CENTER);
        }
        return Operator.instance;
    }

    static get NETWORK() {
        return 'prater';
    }

    /**
     * Search operators and validators
     * @param query
     */
    async search(query: string) {
        let params: any = {
            query,
            search_for: 'operators',
            network: Operator.NETWORK,
        };
        params = new URLSearchParams(params);
        return new ApiRequest({
            url: `${this.baseUrl}/api/search/?${params.toString()}`,
            method: 'GET',
        }).sendRequest();
    }

    /**
     * Get operators
     */
    async getOperatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string) {
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/api/v1/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const requestInfo: RequestData = {
            url: operatorsEndpointUrl,
            method: 'GET',
            headers: [
                { name: 'content-type', value: 'application/json' },
                { name: 'accept', value: 'application/json' },
            ],
        };
        const response: any = await new ApiRequest(requestInfo).sendRequest();
        return response;
    }

    /**
     * Get operators
     */
    async getValidatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string) {
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/api/v1/validators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const requestInfo: RequestData = {
            url: operatorsEndpointUrl,
            method: 'GET',
            headers: [
                { name: 'content-type', value: 'application/json' },
                { name: 'accept', value: 'application/json' },
            ],
        };
        const response: any = await new ApiRequest(requestInfo).sendRequest();
        const validators = response.validators.map(async (validator: any) => {
            console.log(validator);
        });
        validators;
        return response;
    }

    // const buildValidatorStructure = async (validator: string, data: any) => {
    //     if (!data) return { publicKey: validator, status: 'inactive', balance: '0', apr: '0' };
    //     const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${data.pubkey}/performance`;
    //     return new ApiRequest({ url, method: 'GET' }).sendRequest().then((performance: any) => {
    //         const balance = formatNumberFromBeaconcha(data.balance);
    //         const performance7days = performance.data ? formatNumberFromBeaconcha(performance.data.performance7d) : 0;
    //         // @ts-ignore
    //         const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
    //         const status = data.status === 'active_online' ? 'active' : 'inactive';
    //         const publicKey = data.pubkey;
    //         return { publicKey, status, balance, apr };
    //     });
    // };

    /**
     * Get operators
     */
    async getOperators(pageNumber: number = 0) {
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/api/operators/graph?Page=${pageNumber}&perPage=${config.GLOBAL_VARIABLE.OPERATORS_PER_PAGE}`;
        const requestInfo: RequestData = {
            url: operatorsEndpointUrl,
            method: 'GET',
            headers: [
                { name: 'content-type', value: 'application/json' },
                { name: 'accept', value: 'application/json' },
            ],
        };
        const response: any = await new ApiRequest(requestInfo).sendRequest();
        const operators = [...response.operators];
        const shuffledOperators: any[] = [];
        const groupedOperators = group(operators);

        shuffledOperators.push(...shuffle(groupedOperators.verified_operator));
        shuffledOperators.push(...shuffle(groupedOperators.dapp_node));
        shuffledOperators.push(...shuffle(groupedOperators.operator));

        return shuffledOperators;
    }
}

export default Operator;