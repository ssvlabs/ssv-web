import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
}

class SSVStore {
  @observable web3: any = null;
  @observable error: string = '';
  @observable ready: boolean = false;
  @observable wallet: any = null;
  @observable onboardSdk: any = null;
  @observable addingOperator: boolean = false;

  @action.bound
  async registerOperator(transaction: INewOperatorTransaction) {
    try {
      await this.connect();
      if (this.ready) {
        console.debug('Register Operator Transaction Data:', transaction);

        this.addingOperator = true;
        const accounts = await this.web3.eth.getAccounts();
        const address = accounts[0];
        const abi: any = config.CONTRACT.ABI;
        const contractAddress = config.CONTRACT.ADDRESS;
        const contract: Contract = new this.web3.eth.Contract(abi, contractAddress);

        // Send add operator transaction
        contract.methods
          .addOperator(
            transaction.name,
            transaction.pubKey,
            config.CONTRACT.PAYMENT_ADDRESS,
          )
          .send({ from: address })
          .on('receipt', (receipt: any) => {
            console.debug('Contract Receipt', receipt);
          })
          .catch((error: any) => {
            this.addingOperator = false;
            if (error) {
              this.error = error.message;
            }
            console.debug('Contract Error', error);
          });

        // Listen for final event when it's added
        contract.events
          .OperatorAdded({}, (error: any, event: any) => {
            this.addingOperator = false;
            if (error) {
              this.error = error.message;
            }
            console.debug({ error, event });
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              this.error = error.message;
            }
            console.debug({ error, receipt });
          });
      }
    } catch (error: any) {
      console.error('Register Operator Error:', error);
      this.error = error.message;
      this.addingOperator = false;
    }
  }

  @action.bound
  async disconnect() {
    if (this.connected) {
      await this.onboardSdk.walletReset();
      this.wallet = null;
      this.error = '';
      this.web3 = null;
      this.ready = false;
    }
  }

  @action.bound
  async connect() {
    try {
      await this.selectWalletAndCheckIfReady();
      console.debug('OnBoard State:', this.onboardSdk.getState());
    } catch (error: any) {
      this.error = error.message ?? 'Unknown error during connecting to wallet';
      console.error('Connection error:', this.error);
    }
  }

  @computed
  get connected() {
    return this.wallet;
  }

  /**
   * Check wallet is ready to transact
   */
  @action.bound
  async selectWalletAndCheckIfReady() {
    await this.init();
    if (!this.connected) {
      await this.onboardSdk.walletSelect();
    }
    if (this.connected && !this.ready) {
      await this.onboardSdk.walletCheck()
        .then((ready: boolean) => {
          console.debug('Wallet is ready for transaction:', ready);
          this.ready = ready;
        })
        .catch((error: any) => {
          console.error('Wallet check error', error);
        });
    }
  }

  /**
   * Initialize SDK
   */
  @action.bound
  async init() {
    if (this.onboardSdk) {
      return;
    }
    console.debug('Initializing OnBoard SDK..');
    const connectionConfig = {
      dappId: config.ONBOARD.API_KEY,
      networkId: Number(config.ONBOARD.NETWORK_ID),
      subscriptions: {
        wallet: this.onWalletConnected,
      },
    };
    console.debug('OnBoard SDK Config:', connectionConfig);
    this.onboardSdk = Onboard(connectionConfig);
  }

  /**
   * Callback for connected wallet
   * @param wallet
   */
  @action.bound
  async onWalletConnected(wallet: any) {
    console.debug('Wallet Connected:', wallet);
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
  }
}

export default SSVStore;
