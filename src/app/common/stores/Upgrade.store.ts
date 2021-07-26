import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

export const UpgradeSteps = {
  home: 0,
  confirmTransaction: 1,
  disclaimer: 2,
  upgradeSuccess: 3,
};

class UpgradeStore extends BaseStore {
  // UI states
  @observable upgradeStep: number = UpgradeSteps.home;

  // Amounts
  @observable userCdtValue: number = 0;
  @observable userCdtBalance: number = 0;
  @observable loadedCdtBalance: boolean = false;

  // Allowance
  @observable approvedAllowance: boolean = false;

  // Contracts
  @observable cdtContractInstance: Contract | null = null;
  @observable ssvContractInstance: Contract | null = null;
  @observable upgradeContractInstance: Contract | null = null;

  /**
   * Returns instance of CDT old contract
   */
  @computed
  get cdtContract(): Contract {
    if (!this.cdtContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.cdtContractInstance = new walletStore.web3.eth.Contract(config.CONTRACTS.CDT.ABI, config.CONTRACTS.CDT.CONTRACT_ADDRESS);
    }
    return <Contract> this.cdtContractInstance;
  }

  /**
   * Returns instance of SSV contract
   */
  @computed
  get ssvContract(): Contract {
    if (!this.ssvContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.ssvContractInstance = new walletStore.web3.eth.Contract(config.CONTRACTS.SSV.ABI, config.CONTRACTS.SSV.CONTRACT_ADDRESS);
    }
    return <Contract> this.ssvContractInstance;
  }

  /**
   * Returns instance of CDT to SSV conversion contract
   */
  @computed
  get upgradeContract(): Contract {
    if (!this.upgradeContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.upgradeContractInstance = new walletStore.web3.eth.Contract(config.CONTRACTS.DEX.ABI, config.CONTRACTS.DEX.CONTRACT_ADDRESS);
    }
    return <Contract> this.upgradeContractInstance;
  }

  /**
   * Set step of UI
   * @param step
   */
  @action.bound
  setStep(step: number) {
    this.upgradeStep = step;
  }

  /**
   * Get current UI step
   */
  @computed
  get step() {
    return this.upgradeStep;
  }

  /**
   * Save entered amount of CDT for conversion (coming from UI input)
   * @param value
   */
  @action.bound
  setCdtValue(value: number) {
    this.userCdtValue = value;
  }

  /**
   * Set user CDT balance after reading it from CDT contract.
   * @param balance
   */
  @action.bound
  setCdtBalance(balance: number) {
    this.userCdtBalance = this.getStore('Wallet').web3.utils.fromWei(String(balance), 'ether');
  }

  /**
   * Returns CDT balance from the contract if loaded.
   */
  @computed
  get cdtBalance() {
    return this.userCdtBalance;
  }

  /**
   * Get amount of SSV converted from CDT amount.
   */
  @computed
  get ssvValue() {
    return this.userCdtValue * 0.01;
  }

  /**
   * Returns amount of CDT specified by user (UI input).
   */
  @computed
  get cdtValue() {
    return this.userCdtValue;
  }

  /**
   * Check if allowance has been approved and return boolean corresponding value.
   */
  @computed
  get isApprovedAllowance() {
    return this.approvedAllowance;
  }

  /**
   * Set allowance value as boolean.
   * @param approved
   */
  @action.bound
  setApprovedAllowance(approved: boolean) {
    this.approvedAllowance = approved;
  }

  /**
   * Load CDT balance from default account connected to wallet.
   * Returns balance in promise.
   */
  @action.bound
  async loadAccountCdtBalance(): Promise<number> {
    return this.cdtContract
      .methods
      .balanceOf(this.getStore('Wallet').accountAddress)
      .call()
      .then((balance: number) => {
        this.setCdtBalance(balance);
        this.loadedCdtBalance = true;
        return balance;
      });
  }

  /**
   * Flag which tells that CDT balance is already fetched from the CDT contract.
   */
  @computed
  get isLoadedBalance() {
    return this.loadedCdtBalance;
  }

  /**
   * @url https://docs.metamask.io/guide/registering-your-token.html
   */
  @action.bound
  registerSSVTokenInMetamask() {
    // TODO
    console.debug('TODO: register token in user metamask');
  }
}

export default UpgradeStore;
