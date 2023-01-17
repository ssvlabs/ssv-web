import Decimal from 'decimal.js';
import { Contract } from 'web3-eth-contract';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

class SsvStore extends BaseStore {
  accountInterval: any = null;
  // Balances
  walletSsvBalance: number = 0;
  contractDepositSsvBalance: number = 0;

  // Calculation props
  networkFee: number = 0;
  accountBurnRate: number = 0;
  liquidationCollateralPeriod: number = 0;

  // User state
  userState: string = 'operator';

  // Allowance
  userGaveAllowance: boolean = false;

  // Liquidate status
  userLiquidated: boolean = false;

  // Contracts
   ssvContractInstance: Contract | null = null;

  constructor() {
    super();
    makeObservable(this, {
      ssvContract: computed,
      userState: observable,
      deposit: action.bound,
      initUser: action.bound,
      networkFee: observable,
      accountAddress: computed,
      withdrawSsv: action.bound,
      isValidatorState: computed,
      clearSettings: action.bound,
      userLiquidated: observable,
      accountInterval: observable,
      accountBurnRate: observable,
      walletSsvBalance: observable,
      checkAllowance: action.bound,
      getNetworkFees: action.bound,
      toDecimalNumber: action.bound,
      setIsLiquidated: action.bound,
      userGaveAllowance: observable,
      getRemainingDays: action.bound,
      newGetFeeForYear: action.bound,
      userSyncInterval: action.bound,
      approveAllowance: action.bound,
      ssvContractInstance: observable,
      activateValidator: action.bound,
      getContractAddress: action.bound,
      getAccountBurnRate: action.bound,
      getNewAccountBurnRate: action.bound,
      getValidatorOperators: action.bound,
      contractDepositSsvBalance: observable,
      liquidationCollateralPeriod: observable,
      getBalanceFromSsvContract: action.bound,
      prepareSsvAmountToTransfer: action.bound,
      getBalanceFromDepositContract: action.bound,
    });
  }
  /**
   * Returns instance of SSV contract
   */
  get ssvContract(): Contract {
    if (!this.ssvContractInstance) {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.ssvContractInstance = new walletStore.web3.eth.Contract(
        config.CONTRACTS.SSV_TOKEN.ABI,
        this.getContractAddress('ssv_token'),
      );
    }
    return <Contract> this.ssvContractInstance;
  }

  /**
   * Check user state
   */
  get isValidatorState() {
    return this.userState === 'validator';
  }

  /**
   * Get user account address from wallet.
   */
  get accountAddress(): String {
    return this.getStore('Wallet').accountAddress;
  }

  /**
   * Returns days remaining before liquidation
   */
  getRemainingDays({ newBalance, newBurnRate }: { newBalance?: number, newBurnRate?: number }): number {
    try {
      const ssvStore: SsvStore = this.getStore('SSV');
      const burnRatePerBlock = newBurnRate ?? this.accountBurnRate;
      const ssvAmount = newBalance ?? ssvStore.contractDepositSsvBalance;
      const burnRatePerDay = Math.max(burnRatePerBlock * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY, 0);
      const liquidationCollateral = this.liquidationCollateralPeriod / config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
      if (ssvAmount === 0) return 0;
      // if (burnRatePerDay === 0) return 0;
      return Math.max(ssvAmount / burnRatePerDay - liquidationCollateral, 0);
    } catch (e) {
      return 0;
    }
  }

  /**
   * Init User Interval
   */
  async userSyncInterval() {
    await this.checkAllowance();
    await this.getNetworkFees();
    // await this.checkIfLiquidated();
    // await this.getAccountBurnRate();
    await this.getBalanceFromSsvContract();
    // await this.getBalanceFromDepositContract();
  }

  /**
   * Init User
   */
  async initUser() {
    clearInterval(this.accountInterval);
    await this.userSyncInterval();
    this.accountInterval = setInterval(this.userSyncInterval, 2000);
  }

  newGetFeeForYear = (fee: number, decimalPlaces?: number): string => {
    const wrapFee = new Decimal(fee);
    return wrapFee.mul(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed(decimalPlaces ?? 2).toString();
  };

  toDecimalNumber = (fee: number, decimalPlaces?: number): string => {
    return new Decimal(fee).toFixed(decimalPlaces ?? 18).toString();
  };

  /**
   * Get operators per validator
   */
  getValidatorOperators = (publicKey: string): Promise<any> => {
    return new Promise<boolean>((resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      // const operatorStore: OperatorStore = this.getStore('Operator');
      walletStore.getContract.methods.getOperatorsByValidator(publicKey).call().then((operators: any) => {
        resolve(operators);
      });
    });
  };

  /**
   * Gets the contract address regarding the testnet/mainnet flag in url search params.
   * By default mainnet is used.
   * If testnet used - show warning in the top of the page.
   * @param contract
   */
  getContractAddress(contract: string): string {
    const contractType = String(contract).toUpperCase();
    // @ts-ignore
    return config.CONTRACTS[contractType].ADDRESS;
  }

  /**
   * amount in wei
   * @param amountInWei
   */
  prepareSsvAmountToTransfer(amountInWei: string): string {
    return new Decimal(amountInWei).dividedBy(10000000).floor().mul(10000000).toFixed().toString();
  }
  /**
   * Deposit ssv
   * @param amount
   */
  async deposit(amount: string) {
    return new Promise<boolean>((resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
      walletStore.getContract.methods.deposit(this.accountAddress, ssvAmount).send({ from: this.accountAddress })
        .on('receipt', async () => {
          resolve(true);
        })
        .on('transactionHash', (txHash: string) => {
          walletStore.notifySdk.hash(txHash);
        })
        .on('error', () => {
          resolve(false);
        });
    });
  }

  /**
   * Check Account status
   */
  async checkIfLiquidated(): Promise<void> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.setIsLiquidated(await walletStore.getContract.methods.isLiquidated(this.accountAddress).call());
    } catch (e) {
      this.setIsLiquidated(false);
    }
  }

  setIsLiquidated = (status: boolean) => {
    runInAction(() => {
      this.userLiquidated = status;
    });
  };

  setUserState = (status: string) => {
    runInAction(() => {
      this.userState = status;
    });
  };
  /**
   * Init settings
   */
  clearSettings() {
    this.networkFee = 0;
    this.accountBurnRate = 0;
    this.walletSsvBalance = 0;
    this.setIsLiquidated(false);
    this.setUserState('operator');
    this.userGaveAllowance = false;
    this.contractDepositSsvBalance = 0;
    this.liquidationCollateralPeriod = 0;
  }

  /**
   * Get account balance on ssv contract
   */
  async getBalanceFromSsvContract(): Promise<any> {
    const balance = await this.ssvContract.methods.balanceOf(this.accountAddress).call();
    const walletStore = this.getStore('Wallet');
    this.walletSsvBalance = parseFloat(String(walletStore.fromWei(balance, 'ether')));
  }

  /**
   * Get account balance on network contract
   */
  async getBalanceFromDepositContract(): Promise<any> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      const balance = await walletStore.getContract.methods.getAddressBalance(this.accountAddress).call();
      runInAction(() => {
        this.contractDepositSsvBalance = walletStore.fromWei(balance);
      });
    } catch (e: any) {
      // TODO: handle error
      console.log(e.message);
    }
  }

  /**
   * Withdraw ssv
   * @param amount
   * @param withdrawAll
   * @param validatorState
   */
  async withdrawSsv(validatorState: boolean, amount: string, withdrawAll: boolean = false) {
    return new Promise<boolean>((resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      let contractFunction = null;
      const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
      if (withdrawAll && !validatorState) contractFunction = walletStore.getContract.methods.withdrawAll();
      else if (withdrawAll && validatorState) contractFunction = walletStore.getContract.methods.liquidate([this.accountAddress]);
      else if (!withdrawAll) contractFunction = walletStore.getContract.methods.withdraw(ssvAmount);

      if (!contractFunction) return;

      contractFunction.send({ from: this.accountAddress })
        .on('receipt', async () => {
          GoogleTagManager.getInstance().sendEvent({
            category: 'my_account',
            action: 'withdraw_tx',
            label: 'success',
          });
          resolve(true);
        })
        .on('transactionHash', (txHash: string) => {
          walletStore.notifySdk.hash(txHash);
        })
        .on('error', () => {
          GoogleTagManager.getInstance().sendEvent({
            category: 'my_account',
            action: 'withdraw_tx',
            label: 'error',
          });
          resolve(false);
        });
    });
  }

  /**
   * Withdraw ssv
   * @param amount
   */
  async activateValidator(amount: string) {
    return new Promise<boolean>((resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      applicationStore.setIsLoading(true);
      const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
      walletStore.getContract.methods.reactivateAccount(ssvAmount).send({ from: this.accountAddress })
        .on('receipt', async () => {
          applicationStore.setIsLoading(false);
          resolve(true);
        })
        .on('transactionHash', (txHash: string) => {
          walletStore.notifySdk.hash(txHash);
        })
        .on('error', () => {
          applicationStore.setIsLoading(false);
          resolve(false);
        });
    });
  }

  /**
   *  Call userAllowance function in order to know if it has been set or not for SSV contract by user account.
   */
  async checkAllowance(): Promise<void> {
    const allowance = await this.ssvContract
      .methods
      .allowance(
        this.accountAddress,
        this.getContractAddress('ssv_network'),
      ).call();
    this.userGaveAllowance = allowance !== '0';
  }
  /**
   * Set allowance to get CDT from user account.
   */
  async approveAllowance(estimate: boolean = false, callBack?: () => void): Promise<any> {
    return new Promise((resolve => {
      const ssvValue = String('115792089237316195423570985008687907853269984665640564039457584007913129639935');
      const weiValue = ssvValue; // amount ? this.getStore('Wallet').web3.utils.toWei(ssvValue, 'ether') : ssvValue;
      const walletStore: WalletStore = this.getStore('Wallet');

      if (!estimate) {
        console.debug('Approving:', { ssvValue, weiValue });
      }

      const methodCall = this.ssvContract
        .methods
        .approve(this.getContractAddress('ssv_network'), weiValue);

      if (estimate) {
        return methodCall
          .estimateGas({ from: this.accountAddress })
          .then((gasAmount: number) => {
            const floatString = this.getStore('Wallet').web3.utils.fromWei(walletStore.BN(gasAmount).toString(), 'ether');
            return parseFloat(floatString);
          });
      }

      return methodCall
        .send({ from: this.accountAddress })
        .on('receipt', async () => {
          resolve(true);
          this.userGaveAllowance = true;
        })
        .on('transactionHash', (txHash: string) => {
          callBack && callBack();
          walletStore.notifySdk.hash(txHash);
        })
        .on('error', (error: any) => {
          console.debug('Contract Error', error);
          resolve(false);
          this.userGaveAllowance = false;
        });
    }));
  }

  /**
   * Get network fee
   */
  async getNetworkFees() {
    const walletStore: WalletStore = this.getStore('Wallet');
    const networkContract = walletStore.getContract;
    const liquidationCollateral = await networkContract.methods.getLiquidationThresholdPeriod().call();
    const networkFee = await networkContract.methods.getNetworkFee().call();
    // hardcoded should be replaced
    this.networkFee = walletStore.fromWei(networkFee);
    this.liquidationCollateralPeriod = Number(liquidationCollateral);
  }

  /**
   * Get account burn rate
   */
  async getAccountBurnRate(): Promise<void> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      const burnRate = await walletStore.getContract.methods.getAddressBurnRate(this.accountAddress).call();
      this.accountBurnRate = this.getStore('Wallet').web3.utils.fromWei(burnRate);
    } catch (e: any) {
      // TODO: handle error
      console.log(e.message);
    }
  }
  /**
   * Get new account burn rate
   */
  getNewAccountBurnRate(oldOperatorsFee: number, newOperatorsFee: number): number {
    return this.accountBurnRate - oldOperatorsFee + newOperatorsFee;
  }

  // /**
  //  * @url https://docs.metamask.io/guide/registering-your-token.html
  //  */
  // registerSSVTokenInMetamask() {
  //     return new Promise((resolve, reject) => {
  //         return this.getStore('Wallet').web3.currentProvider.send({
  //             method: 'wallet_watchAsset',
  //             params: {
  //                 type: 'ERC20',
  //                 options: {
  //                     address: this.getContractAddress('ssv'),
  //                     symbol: 'SSV',
  //                     decimals: 18,
  //                 },
  //             },
  //         }, (error: any, success: any) => {
  //             if (error) {
  //                 reject(error);
  //             } else {
  //                 resolve(success);
  //             }
  //         });
  //     }).then((success: any) => {
  //         if (!success) {
  //             this.getStore('Notifications')
  //                 .showMessage('Can not add SSV to wallet!', 'error');
  //         }
  //     }).catch((error: any) => {
  //         console.error('Can not add SSV token to wallet', error);
  //         this.getStore('Notifications')
  //             .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
  //     });
  // }
}

export default SsvStore;
