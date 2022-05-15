import config from '~app/common/config';
import axios from 'axios';

type OperatorsListQuery = {
    page?: number,
    search?: string,
    type?: string[],
    perPage?: number
    status?: boolean,
    withFee?: boolean,
    ordering?: string,
    validatorsCount?: boolean,
};

type OperatorValidatorListQuery = {
    page?: number,
    perPage?: number
    operatorId: number,
};

class Operator {
    operator: any = null;
    operators: any = null;
    operatorQuery: any = null;
    operatorsQuery: any = null;
    operatorValidators: any = null;
    operatorValidatorsQuery: any = null;
    operatorValidatorsPagination: any = null;
    operatorsPagination: any = null;
    ownerAddressOperators: any = null;
    ownerAddressPagination: any = null;
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
        this.operatorsPagination = null;
        this.ownerAddressOperators = null;
        this.ownerAddressPagination = null;
    }

    clearOperatorsByOwnerAddressCache() {
        this.ownerAddressOperators = null;
        this.ownerAddressPagination = null;
    }

    /**
     * Get operators by owner Address
     */
    async getOperatorsByOwnerAddress(page: number = 1, perPage: number = 5, ownerAddress: string, force?: boolean) {
        if (!force && this.ownerAddressPagination?.page === page && this.ownerAddressPagination.per_page === perPage) {
            return { pagination: this.ownerAddressPagination, operators: this.ownerAddressOperators };
        }
        const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}&withFee=true`;
        try {
            const response: any = await axios.get(operatorsEndpointUrl);
            this.ownerAddressOperators = response.data.operators;
            this.ownerAddressPagination = response.data.pagination;
            return response.data;
        } catch (e) {
            return { operators: [], pagination: {} };
        }
    }

    /**
     * Get operators
     */
    async getOperators(props: OperatorsListQuery) {
        const { page, perPage, type, ordering, status, search, withFee, validatorsCount } = props;
        let operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators?`;
        if (validatorsCount) operatorsEndpointUrl += 'validatorsCount=true&';
        if (search) operatorsEndpointUrl += `search=${search}&`;
        if (ordering) operatorsEndpointUrl += `ordering=${ordering}&`;
        if (status) operatorsEndpointUrl += 'status=true&';
        if (page) operatorsEndpointUrl += `page=${page}&`;
        if (perPage) operatorsEndpointUrl += `perPage=${perPage}&`;
        if (withFee) operatorsEndpointUrl += 'withFee=true&';
        if (type) operatorsEndpointUrl += `type=${type.join(',')}`;

        if (this.operatorsQuery === operatorsEndpointUrl) {
            return { operators: this.operators, pagination: this.operatorsPagination };
        }

        try {
            const response: any = (await axios.get(operatorsEndpointUrl)).data;

            if (response.operators) {
                this.operators = response.operators;
                this.operatorsQuery = operatorsEndpointUrl;
                this.operatorsPagination = response.pagination;
            }

            return response;
        } catch (e) {
            return { operators: [], pagination: {} };
        }
    }

    /**
     * Get operator
     */
    async getOperator(operatorId: string) {
        const operatorEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/prater/${operatorId}?performances=24hours&withFee=true`;

        if (this.operatorQuery === operatorEndpointUrl) {
            return this.operator;
        }

        try {
            const response: any = (await axios.get(operatorEndpointUrl)).data;

            if (response) {
                this.operator = response;
                this.operatorQuery = operatorEndpointUrl;
            }

            return response;
        } catch (e) {
            return null;
        }
    }
    /**
     * Get operator validators
     */
    async getOperatorValidators(props: OperatorValidatorListQuery) {
        const { page, perPage, operatorId } = props;
        const operatorEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/in_operator/${operatorId}?page=${page}&perPage=${perPage}`;

        if (this.operatorValidatorsQuery === operatorEndpointUrl) {
            return { validators: this.operatorValidators, pagination: this.operatorValidatorsPagination };
        }

        try {
            const response: any = (await axios.get(operatorEndpointUrl)).data;

            if (response) {
                this.operatorValidators = response.validators;
                this.operatorValidatorsPagination = response.pagination;
                this.operatorValidatorsQuery = operatorEndpointUrl;
            }

            return response;
        } catch (e) {
            return { validators: [], pagination: {} };
        }
    }
}

export default Operator;