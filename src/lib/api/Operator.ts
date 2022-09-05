import axios from 'axios';
import config from '~app/common/config';

type OperatorsListQuery = {
  page?: number,
  search?: string,
  type?: string[],
  perPage?: number
  ordering?: string,
};

type OperatorValidatorListQuery = {
  page?: number,
  perPage?: number
  operatorId: number,
};

class Operator {
  ownerAddress: string = '';
  noOperatorsForOwnerAddress: boolean = false;
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
    const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}&withFee=true&ts=${new Date().getTime()}`;
    try {
      this.ownerAddress = ownerAddress;
      return (await axios.get(operatorsEndpointUrl)).data;
    } catch (e) {
      return { operators: [], pagination: {} };
    }
  }

  /**
   * Get operators
   */
  async getOperators(props: OperatorsListQuery) {
    const { page, perPage, type, ordering, search } = props;
    let operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators?`;
    if (search) operatorsEndpointUrl += `search=${search}&`;
    if (ordering) operatorsEndpointUrl += `ordering=${ordering}&`;
    if (page) operatorsEndpointUrl += `page=${page}&`;
    if (perPage) operatorsEndpointUrl += `perPage=${perPage}&`;
    if (type) operatorsEndpointUrl += `type=${type.join(',')}`;
    operatorsEndpointUrl += `ts=${new Date().getTime()}`;

    try {
      return (await axios.get(operatorsEndpointUrl)).data;
    } catch (e) {
      return { operators: [], pagination: {} };
    }
  }

  /**
   * Get operator
   */
  async getOperator(operatorId: number | string) {
    const operatorEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/operators/${operatorId}?performances=24hours&withFee=true&ts=${new Date().getTime()}`;
    try {
      return (await axios.get(operatorEndpointUrl)).data;
    } catch (e) {
      return null;
    }
  }

  /**
   * Get operator validators
   */
  async getOperatorValidators(props: OperatorValidatorListQuery) {
    const { page, perPage, operatorId } = props;
    const operatorEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/in_operator/${operatorId}?page=${page}&perPage=${perPage}&ts=${new Date().getTime()}`;
    try {
      return (await axios.get(operatorEndpointUrl)).data;
    } catch (e) {
      return { validators: [], pagination: {} };
    }
  }
}

export default Operator;
