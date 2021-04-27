import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { action, observable } from 'mobx';
import config from '~app/common/config';

class WalletStore {
  @observable connected: boolean = false;
  @observable onboard: any = null;
  @observable web3: any = null;
  @observable wallet: any = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.initOnboard = this.initOnboard.bind(this);
    this.onWalletConnected = this.onWalletConnected.bind(this);
  }

  @action connect() {
    this.initOnboard();
  }

  @action initOnboard() {
    if (this.onboard) {
      return;
    }
    console.debug('Connecting to wallet..');
    const connectionConfig = {
      dappId: config.ONBOARD.API_KEY,
      networkId: Number(config.ONBOARD.NETWORK_ID),
      subscriptions: {
        wallet: this.onWalletConnected,
      },
    };
    console.warn(connectionConfig);
    this.onboard = Onboard(connectionConfig);
  }

  @action async onWalletConnected(wallet: any) {
    console.debug('On connected:', wallet);
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
    await this.onboard.walletSelect();
    await this.onboard.walletCheck();
    this.connected = true;
  }
}

export default WalletStore;
