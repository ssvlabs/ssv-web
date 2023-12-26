import { observable, makeObservable, action } from 'mobx';
import Operator from '~lib/api/Operator';
import { translations } from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import AccountStore from '~app/common/stores/applications/SsvWeb/Account.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { KeySharesItem } from 'ssv-keys';

class MigrationStore extends BaseStore  {
    migrationFile: File | null = null;

    constructor() {
        super();
        makeObservable(this, {
            migrationFile: observable,
            setMigrationFile: action.bound,
            isJsonFile: action.bound,
            removeMigrationFile: action.bound,
            validateMigrationFile: action.bound,
        });
    }

    setMigrationFile(migrationFile: File, callback: Function) {
        this.migrationFile = migrationFile;
        callback();
    }

    removeMigrationFile() {
        this.migrationFile = null;
    }

    async validateMigrationFile(){
        const fileJson: any = await this.migrationFile?.text();
        const parsedJson = JSON.parse(fileJson);
        for (const [index, keyshare] of parsedJson.entries()) {
            const response = await this.validateKeyshare(keyshare, index);
            if (response.id !== 0) {
                return response;
            }
        }
        return { id: 0, errorMessage: '', subErrorMessage: '' };
    }

    isJsonFile(file: File | null): boolean {
        return file?.type === 'application/json';
    }

    async validateKeyshare(keyshare: any, index: number) {
        const OK_RESPONSE_ID = 0;
        const ERROR_RESPONSE_ID = 4;
        const OWNER_ADDRESS_NOT_MATCHING = 3;
        const PUBLIC_KEY_ERROR_ID = 5;
        const OPERATOR_NOT_EXIST_ID = 1;
        const OPERATOR_NOT_MATCHING_ID = 2;
        const keyShares = new KeySharesItem();
        const accountStore: AccountStore = this.getStore('Account');
        const operatorStore: OperatorStore = this.getStore('Operator');
        const walletStore: WalletStore = this.getStore('Wallet');
        await accountStore.getOwnerNonce(walletStore.accountAddress);
        const { ownerNonce } = accountStore;
        const { OK_RESPONSE,
            OPERATOR_NOT_EXIST_RESPONSE,
            CATCH_ERROR_RESPONSE,
            INCORRECT_OWNER_ADDRESS_ERROR,
            VALIDATOR_PUBLIC_KEY_ERROR,
            INVALID_OPERATOR_DETAILS } = translations.VALIDATOR.KEYSHARE_RESPONSE;
        try {
            const { payload, data } = keyshare;
            const operatorPublicKeys = data.operators.map((operator: any) => operator.operatorKey);
            const keyShareOperators = payload.operatorIds.sort();
            if (payload.publicKey.length !== 98) {
                return { ...VALIDATOR_PUBLIC_KEY_ERROR, id: PUBLIC_KEY_ERROR_ID };
            }
            if (data.ownerAddress !== walletStore.accountAddress) {
               return { errorMessage: INCORRECT_OWNER_ADDRESS_ERROR.errorMessage, subErrorMessage: `${INCORRECT_OWNER_ADDRESS_ERROR.subErrorMessage} ${data.ownerAddress}`, id: OWNER_ADDRESS_NOT_MATCHING };
            }
                const selectedOperators = await Operator.getInstance().getOperatorsByIds(keyShareOperators);
                if (!selectedOperators) return { ...OPERATOR_NOT_EXIST_RESPONSE, id: OPERATOR_NOT_EXIST_ID };
                if (selectedOperators?.some((operator: IOperator) => !operatorPublicKeys.includes(operator.public_key))) {
                    return { errorMessage: INVALID_OPERATOR_DETAILS.message, subErrorMessage: INVALID_OPERATOR_DETAILS.subErrorMessage, id: OPERATOR_NOT_MATCHING_ID };
                }
                operatorStore.selectOperators(selectedOperators);
            const nonce = Number(ownerNonce) + index;
            await keyShares.validateSingleShares(payload.sharesData, { ownerAddress: walletStore.accountAddress, ownerNonce: nonce, publicKey: payload.publicKey } );
            return { ...OK_RESPONSE, id: OK_RESPONSE_ID };
        } catch (e: any) {
            return { ...CATCH_ERROR_RESPONSE, id: ERROR_RESPONSE_ID, errorMessage: e.message };
        }
    }
}

export default MigrationStore;
