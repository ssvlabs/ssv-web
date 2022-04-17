import config from '~app/common/config';
import axios from 'axios';

type OperatorsListQuery = {
    page?: number,
    search?: string,
    type?: string[],
    perPage?: number
    status?: boolean,
    ordering?: string,
    validatorsCount?: boolean,
};

class Operator {
    operators: any = null;
    pagination: any = null;
    private static instance: Operator;
    private readonly baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        setInterval(this.clearOperatorsCache.bind(this), 600000);
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

    clearOperatorsCache() {
        this.operators = null;
        this.pagination = null;
    }

    /**
     * Get operators by owner Address
     */
    async getOperatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string, force?: boolean) {
        if (!force && this.pagination?.page === page && this.pagination.per_page === perPage) {
            return { pagination: this.pagination, operators: this.operators };
        }
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const response: any = await axios.get(operatorsEndpointUrl);
        this.operators = response.data.operators;
        this.pagination = response.data.pagination;
        return response.data;
    }

    /**
     * Get operators
     */
    async getOperators(props: OperatorsListQuery) {
        const { page, perPage, type, ordering, status, search, validatorsCount } = props;
        let operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators?`;
        if (validatorsCount) operatorsEndpointUrl += 'validatorsCount=true&';
        if (search) operatorsEndpointUrl += `search=${search}&`;
        if (ordering) operatorsEndpointUrl += `ordering=${ordering}&`;
        if (status) operatorsEndpointUrl += 'status=true&';
        if (page) operatorsEndpointUrl += `page=${page}&`;
        if (perPage) operatorsEndpointUrl += `perPage=${perPage}&`;
        if (type) operatorsEndpointUrl += `type=${type.join(',')}`;

        const response: any = await axios.get(operatorsEndpointUrl);
        return response.data;
    }
}

export default Operator;