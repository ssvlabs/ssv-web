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
  @observable userCdtBalance: number | null = null;

  // Allowance
  @observable userAllowance: number | string | null = null;

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
      this.cdtContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.CDT.ABI,
        config.CONTRACTS.CDT.CONTRACT_ADDRESS,
      );
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
      this.ssvContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.SSV.ABI,
        config.CONTRACTS.SSV.CONTRACT_ADDRESS,
      );
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
      this.upgradeContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.DEX.ABI,
        config.CONTRACTS.DEX.CONTRACT_ADDRESS,
      );
    }
    return <Contract> this.upgradeContractInstance;
  }

  /**
   * Get current UI step
   */
  @computed
  get step() {
    return this.upgradeStep;
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
   * Check if userAllowance has been approved and return boolean corresponding value.
   */
  @computed
  get approvedAllowance() {
    return this.userAllowance;
  }

  /**
   * Get user account address from wallet.
   */
  get accountAddress(): String {
    return this.getStore('Wallet').accountAddress;
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
  setCdtBalance(balance: number | null) {
    if (!balance) {
      this.userCdtBalance = balance;
      return;
    }
    this.userCdtBalance = this.getStore('Wallet').web3.utils.fromWei(String(balance), 'ether');
  }

  /**
   * Set userAllowance value as boolean.
   * @param approved
   */
  @action.bound
  setApprovedAllowance(approved: number | string | null) {
    this.userAllowance = approved;
  }

  /**
   *  Call userAllowance function in order to know if it has been set or not for SSV contract by user account.
   */
  @action.bound
  async checkAllowance(): Promise<number> {
    return this.cdtContract
      .methods
      .allowance(
        this.accountAddress,
        config.CONTRACTS.DEX.CONTRACT_ADDRESS,
      )
      .call()
      .then((allowance: number) => {
        // const allowanceValue = parseFloat(String(allowance));
        // const weiValue = this.getStore('Wallet').web3.utils.toWei(String(allowanceValue), 'ether');
        this.setApprovedAllowance(parseFloat(String(allowance)));
        // DEV: stub to show first allowance button
        // this.setApprovedAllowance(0);
        return this.userAllowance;
      });
  }

  /**
   * Set allowance to get CDT from user account.
   */
  @action.bound
  async approveAllowance(amount?: number, estimate: boolean = false): Promise<any> {
    const cdtValue = String(amount ?? `1${new Array(30).fill(0).join('')}`);
    const weiValue = this.getStore('Wallet').web3.utils.toWei(cdtValue, 'ether');

    if (!estimate) {
      console.debug('Approving:', { cdtValue, weiValue });
    }

    const methodCall = this.cdtContract
      .methods
      .approve(config.CONTRACTS.DEX.CONTRACT_ADDRESS, weiValue);

    if (estimate) {
      return methodCall
        .estimateGas({ from: this.accountAddress })
        .then((gasAmount: number) => {
          const floatString = this.getStore('Wallet').web3.utils.fromWei(String(gasAmount), 'ether');
          return parseFloat(floatString);
        });
    }

    return methodCall
      .send({ from: this.accountAddress })
      .then(() => {
        return cdtValue;
      });
  }

  /**
   * Convert CDT to SSV
   * @param estimate
   */
  @action.bound
  async convertCdtToSsv(estimate: boolean = false): Promise<any> {
    console.debug(`${estimate ? 'Estimating' : 'Converting'} ${this.userCdtValue} CDT..`);
    
    const weiValue = this.getStore('Wallet').web3.utils.toWei(String(this.userCdtValue), 'ether');
    const methodCall = this.upgradeContract
      .methods
      .convertCDTToSSV(weiValue);

    if (estimate) {
      return methodCall
        .estimateGas({ from: this.accountAddress })
        .then((gasAmount: number) => {
          const floatString = this.getStore('Wallet').web3.utils.fromWei(String(gasAmount), 'ether');
          return parseFloat(floatString);
        });
    }

    return methodCall
      .send({ from: this.accountAddress })
      .then((conversionResult: any) => {
        return conversionResult;
      });
  }

  /**
   * Load CDT balance from default account connected to wallet.
   * Returns balance in promise.
   */
  @action.bound
  async loadAccountCdtBalance(): Promise<number> {
    return this.cdtContract
      .methods
      .balanceOf(this.accountAddress)
      .call()
      .then((balance: number) => {
        this.setCdtBalance(balance);
        return balance;
      });
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
