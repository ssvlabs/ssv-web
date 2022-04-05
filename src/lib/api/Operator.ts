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
     * Get operators by owner Address
     */
    async getOperatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string) {
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}`;
        const response: any = await axios.get(operatorsEndpointUrl);
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