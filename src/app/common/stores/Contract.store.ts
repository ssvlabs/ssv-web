import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
}

class ContractStore {
  @observable web3: any = null;
  @observable errorMessage: string = '';
  @observable successMessage: string = '';
  @observable ready: boolean = false;
  @observable wallet: any = null;
  @observable onboardSdk: any = null;
  @observable addingOperator: boolean = false;
  @observable contractReceipt: any = null;

  @action.bound
  cleanBeforeTransaction() {
    this.errorMessage = '';
    this.successMessage = '';
    this.contractReceipt = null;
    this.addingOperator = true;
  }

  @action.bound
  setErrorMessage(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
  }

  @action.bound
  setSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
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
          .catch((error: any) => {
            this.addingOperator = false;
            if (error) {
              this.setErrorMessage(error.message);
            }
            console.debug('Contract Error', error);
          });

        // Listen for final event when it's added
        contract.events
          .OperatorAdded({}, (error: any, event: any) => {
            this.addingOperator = false;
            if (error) {
              this.setErrorMessage(error.message);
            } else {
              this.setSuccessMessage('You successfully added operator!');
            }
            console.debug({ error, event });
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              this.setErrorMessage(error.message);
            }
            console.debug({ error, receipt });
          });
      }
    } catch (error: any) {
      console.error('Register Operator Error:', error);
      this.setErrorMessage(error.message);
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
      this.setErrorMessage(error.message ?? 'Unknown errorMessage during connecting to wallet');
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
          this.setSuccessMessage('Wallet is ready!');
        })
        .catch((error: any) => {
          console.error('Wallet check errorMessage', error);
          this.setErrorMessage('Wallet is not connected!');
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
    this.setSuccessMessage('Successfully connected to Wallet!');
  }
}

export default ContractStore;
