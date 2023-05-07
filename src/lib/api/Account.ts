import axios from 'axios';
import { Retryable } from 'typescript-retry-decorator';
import config from '~app/common/config';

class Account {
    private static instance: Account;
    private readonly baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    static getInstance(): Account {
        if (!Account.instance) {
            Account.instance = new Account(config.links.SSV_API_ENDPOINT);
        }
        return Account.instance;
    }

    async getFeeRecipientAddress(publicKey: string) {
        try {
            const url = `${String(config.links.SSV_API_ENDPOINT)}/accounts/${publicKey}`;
            return await this.getData(url);
        } catch (e) {
            return null;
        }
    }

    @Retryable(config.retry.default)
    async getData(url: string, skipRetry?: boolean) {
        try {
            return (await axios.get(url)).data;
        } catch (e) {
            if (skipRetry) {
                return null;
            }
            throw e;
        }
    }
}

export default Account;
