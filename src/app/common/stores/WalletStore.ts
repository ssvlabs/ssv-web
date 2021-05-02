import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/NotificationsStore';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
}

class WalletStore {
  notificationsStore: NotificationsStore;
  @observable web3: any = null;
  @observable errorMessage: string = '';
  @observable successMessage: string = '';
  @observable ready: boolean = false;
  @observable wallet: any = null;
  @observable onboardSdk: any = null;
  @observable addingOperator: boolean = false;
  @observable contractReceipt: any = null;

  constructor() {
    this.notificationsStore = StoresProvider.getInstance().getStore('notifications');
  }

  @action.bound
  cleanBeforeTransaction() {
    this.errorMessage = '';
    this.successMessage = '';
    this.contractReceipt = null;
    this.addingOperator = true;
  }

  @action.bound
  setEventMessage(message: string, severity: string) {
    this.notificationsStore.setShowSnackBar(true);
    this.notificationsStore.setMessage(message);
    this.notificationsStore.setMessageSeverity(severity);
  }

  @action.bound
  async registerOperator(transaction: INewOperatorTransaction) {
    try {
      await this.connect();
      if (this.ready) {
        this.cleanBeforeTransaction();
        console.debug('Register Operator Transaction Data:', transaction);

        const accounts: string[] = await this.web3.eth.getAccounts();
        const address: string = accounts[0];
        const abi: any = config.CONTRACT.ABI;
        const contractAddress: string = config.CONTRACT.ADDRESS;
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
            this.contractReceipt = receipt;
          })
          .on('error', (error: any) => {
            this.addingOperator = false;
            this.setEventMessage(error.message, 'error');
            console.debug('Contract Error', error);
          })
          .catch((error: any) => {
            this.addingOperator = false;
            if (error) {
              this.setEventMessage(error.message, 'error');
            }
            console.debug('Contract Error', error);
          });

        // Listen for final event when it's added
        contract.events
          .OperatorAdded({}, (error: any, event: any) => {
            this.addingOperator = false;
            if (error) {
              this.setEventMessage(error.message, 'error');
            } else {
              this.setEventMessage('You successfully added operator!', 'success');
            }
            console.debug({ error, event });
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              this.setEventMessage(error.message, 'error');
            }
            console.debug({ error, receipt });
          });
      }
    } catch (error: any) {
      console.error('Register Operator Error:', error);
      this.setEventMessage(error.message, 'error');
      this.addingOperator = false;
    }
  }

  @action.bound
  async disconnect() {
    if (this.connected) {
      await this.onboardSdk.walletReset();
      this.cleanBeforeTransaction();
      this.wallet = null;
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
      this.setEventMessage(error.message ?? 'Unknown errorMessage during connecting to wallet', 'error');
      console.error('Connection errorMessage:', this.errorMessage);
    }
  }

  @computed
  get connected() {
    return this.wallet?.name;
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
          this.setEventMessage('Wallet is ready!', 'success');
        })
        .catch((error: any) => {
          console.error('Wallet check errorMessage', error);
          this.setEventMessage('Wallet is not connected!', 'error');
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
    this.setEventMessage('Successfully connected to Wallet!', 'success');
  }
}

export default WalletStore;
