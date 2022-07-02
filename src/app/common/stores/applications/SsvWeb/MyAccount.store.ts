import { action, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import Operator from '~lib/api/Operator';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
action;
class MyAccountStore extends BaseStore {
    @observable ownerAddressOperators: any = [];
    @observable ownerAddressOperatorsPagination: any = {};

    constructor() {
        super();
        setInterval(() => {
            const walletStore: WalletStore = this.getStore('Wallet');
            Operator.getInstance().getOperatorsByOwnerAddress(1, 5, walletStore.accountAddress).then((response) => {
                this.ownerAddressOperators = response.operators;
                this.ownerAddressOperatorsPagination = response.pagination;
            });
        }, 5000);
    }
}

export default MyAccountStore;
