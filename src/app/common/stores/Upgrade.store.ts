import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import { FixedNumber } from '@ethersproject/bignumber';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { formatFloatToMaxPrecision } from '~lib/utils/numbers';
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
  @observable userAgreedOnTerms: boolean = false;

  // Amounts
  @observable userCdtValue: number | string = 0;
  @observable userCdtBalance: number | null = null;

  // Allowance
  @observable userAllowance: number | string | null = null;

  // Contracts
  @observable cdtContractInstance: Contract | null = null;
  @observable ssvContractInstance: Contract | null = null;
  @observable upgradeContractInstance: Contract | null = null;

  // Results
  @observable upgradeTxHash: string = '';

  /**
   * Returns instance of CDT old contract
   */
  @computed
  get cdtContract(): Contract {
    if (!this.cdtContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.cdtContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.CDT.ABI,
        this.getContractAddress('cdt'),
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
        this.getContractAddress('ssv'),
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
        this.getContractAddress('dex'),
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
    return parseFloat(String(this.userCdtValue)) * 0.01;
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

  @computed
  get isTestnet() {
    const params = new URLSearchParams(window.location.search);
    return params.get('testnet');
  }

  @computed
  get isUserAgreedOnTerms() {
    return this.userAgreedOnTerms;
  }

  /**
   * Balance format should include 4 decimals (e.g. 1.12345678 → 1.1234)
   * In cases where the 4 decimals are all 0’s, show all digits until the last digit that is not 0
   * (e.g. 1.000001234 → 1.000001).
   *
   * @param maxNonZeroFraction
   */
  @action.bound
  cdtBalanceFormatted(maxNonZeroFraction: number = 4) {
    const maxPrecisionBalanceString = formatFloatToMaxPrecision(<number> this.cdtBalance);
    if (maxPrecisionBalanceString.indexOf('.') === -1) {
      return maxPrecisionBalanceString;
    }
    const parts = maxPrecisionBalanceString.split('.');
    const leftPart = parts[0];
    let rightPart = parts[1];
    const rightNumbers = [];
    let allRightZeros = true;
    for (let i = 0; i < rightPart.length; i += 1) {
      const rightDigit = rightPart.substring(i, i + 1);
      if (rightDigit !== '0') {
        allRightZeros = false;
      }
      rightNumbers.push(rightDigit);
      if (rightNumbers.length >= maxNonZeroFraction && !allRightZeros) {
        break;
      }
    }
    rightPart = rightNumbers.join('');
    return `${leftPart}.${rightPart}`;
  }

  @action.bound
  getUpgradeTxHash() {
    return this.upgradeTxHash;
  }

  @action.bound
  setUpgradeTxHash(txHash: string) {
    this.upgradeTxHash = txHash;
  }

  @action.bound
  toFixedNumber(num: any) {
    return FixedNumber.from(num);
  }

  /**
   * Gets the contract address regarding the testnet/mainnet flag in url search params.
   * By default mainnet is used.
   * If testnet used - show warning in the top of the page.
   * @param contract
   */
  @action.bound
  getContractAddress(contract: string): string {
    const contractType = String(contract).toUpperCase();
    // @ts-ignore
    const contractData = config.CONTRACTS[contractType].CONTRACT_ADDRESS;
    return this.isTestnet ? contractData.TESTNET : contractData.MAINNET;
  }

  /**
   * Set step of UI
   * @param step
   */
  @action.bound
  setStep(step: number) {
    this.upgradeStep = step;
  }

  @action.bound
  setUserAgreedOnTerms(agreed: boolean) {
    this.userAgreedOnTerms = agreed;
  }

  /**
   * Save entered amount of CDT for conversion (coming from UI input)
   * @param value
   */
  @action.bound
  setCdtValue(value: number | string) {
    this.userCdtValue = value;
  }

  /**
   * Set user CDT balance after reading it from CDT contract.
   * @param balance
   */
  @action.bound
  setCdtBalance(balance: number | null) {
    // Case when we need to unset the balance.
    if (!balance) {
      this.userCdtBalance = balance;
      return;
    }
    // Otherwise we set it in wei
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
        this.getContractAddress('dex'),
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
    const cdtValue = String(amount ?? '115792089237316195423570985008687907853269984665640564039457584007913129639935');
    const weiValue = amount ? this.getStore('Wallet').web3.utils.toWei(cdtValue, 'ether') : cdtValue;

    if (!estimate) {
      console.debug('Approving:', { cdtValue, weiValue });
    }

    const methodCall = this.cdtContract
      .methods
      .approve(this.getContractAddress('dex'), weiValue);

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
          console.debug(`Estimated Gas Amount is ${gasAmount} Gwei`);
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
    return new Promise((resolve, reject) => {
      return this.getStore('Wallet').web3.currentProvider.send({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.getContractAddress('ssv'),
            symbol: 'SSV',
            decimals: 18,
          },
        },
      }, (error: any, success: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    }).then((success: any) => {
      if (success) {
        this.getStore('Notifications')
          .showMessage('SSV successfully added to wallet!', 'success');
      } else {
        this.getStore('Notifications')
          .showMessage('Can not add SSV to wallet!', 'error');
      }
    }).catch((error: any) => {
      console.error('Can not add SSV token to wallet', error);
      this.getStore('Notifications')
        .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
    });
  }
}

export default UpgradeStore;
