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