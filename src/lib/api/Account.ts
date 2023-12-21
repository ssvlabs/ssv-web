import axios from 'axios';
import { Retryable } from 'typescript-retry-decorator';
import config from '~app/common/config';
import { web3 } from 'ssv-keys/dist/tsc/src/lib/helpers/web3.helper';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

class Account {
    private static instance: Account;
    private readonly baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    static getInstance(): Account {
        if (!Account.instance) {
            Account.instance = new Account(getStoredNetwork().api);
        }
        return Account.instance;
    }

    async getAccountData(publicKey: string) {
        try {
            const url = `${getStoredNetwork().api}/accounts/${web3.utils.toChecksumAddress(publicKey)}`;
            return await this.getData(url, false);
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
