import axios from 'axios';
import config from '~app/common/config';

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

    async getOwnerAddressCost(ownerAddress: string): Promise<any> {
        try {
            const endpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/owned_by/${ownerAddress}/cost`;
            return (await axios.get(endpointUrl)).data;
        } catch (e) {
            return null;
        }
    }

    async validatorsByOwnerAddress(query: string): Promise<any> {
        try {
            const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators${query}`;
            return (await axios.get(operatorsEndpointUrl)).data;
        } catch (e) {
            return { validators: [], pagination: {} };
        }
    }

    async getValidator(publicKey: string, checkExistence?: boolean) {
        try {
            const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/${publicKey.replace('0x', '')}${checkExistence ? '?performances=24hours&withFee=true' : ''}`;
            return (await axios.get(url)).data;
        } catch (e) {
            return null;
        }
    }
}

export default Validator;