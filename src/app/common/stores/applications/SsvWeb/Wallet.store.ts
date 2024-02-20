import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { store } from '~app/store';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import notifyService from '~root/services/notify.service';
import { initContracts } from '~root/services/contracts.service';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number = 1;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private myAccountStore: MyAccountStore = this.getStore('MyAccount');

  constructor() {
    super();
    makeObservable(this, {
      wallet: observable,
      networkId: observable,
      resetUser: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      accountAddress: observable,
      initWallet: action.bound,
    });
  }

  async initWallet(wallet: WalletState, connectedChain: ConnectedChain) {
    await this.resetUser();
    console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initWallet', wallet, connectedChain);
    this.wallet = wallet;
    notifyService.init(connectedChain.id);
    this.accountAddress = wallet.accounts[0]?.address;
    initContracts({ provider: wallet.provider, network: getStoredNetwork(), shouldUseRpcUrl: wallet.label === 'WalletConnect' });
    await this.ssvStore.initUser();
    await this.operatorStore.initUser();
    this.myAccountStore.setIntervals();
    await Promise.all([
      this.myAccountStore.getOwnerAddressOperators({}),
      this.myAccountStore.getOwnerAddressClusters({}),
      this.operatorStore.updateOperatorValidatorsLimit(),
    ]);
    if (this.myAccountStore?.ownerAddressClusters?.length) {
      store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
    } else if (this.myAccountStore?.ownerAddressOperators?.length) {
      store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }
  }

  async resetUser() {
    this.ssvStore.clearUserSyncInterval();
    this.myAccountStore.clearIntervals();
    this.ssvStore.clearSettings();
    this.operatorStore.clearSettings();
    ApiParams.cleanStorage();
    this.accountAddress = '';
    this.wallet = null;
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }
}

export default WalletStore;
