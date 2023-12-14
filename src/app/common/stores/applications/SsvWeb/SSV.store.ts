import Decimal from 'decimal.js';
// import { Contract } from 'web3-eth-contract';
import { Contract, ethers } from 'ethers';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { GasGroup } from '~app/common/config/gasLimits';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import { getFixedGasLimit } from '~lib/utils/gasLimitHelper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ProcessStore, { SingleCluster, SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';

class SsvStore extends BaseStore {
  accountInterval: any = null;
  // Balances
  walletSsvBalance: number = 0;
  contractDepositSsvBalance: number = 0;
  approvedAllowance: number = 0;

  // Calculation props
  networkFee: number = 0;
  accountBurnRate: number = 0;
  liquidationCollateralPeriod: number = 0;
  minimumLiquidationCollateral: number = 0;
  // Allowance
  userGaveAllowance: boolean = false;

  // Liquidate status
  userLiquidated: boolean = false;

  // Contracts
   ssvContractInstance: Contract | null = null;
  private syncingUser: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      ssvContract: computed,
      deposit: action.bound,
      initUser: action.bound,
      networkFee: observable,
      accountAddress: computed,
      withdrawSsv: action.bound,
      clearSettings: action.bound,
      userLiquidated: observable,
      accountInterval: observable,
      accountBurnRate: observable,
      walletSsvBalance: observable,
      approvedAllowance: observable,
      checkAllowance: action.bound,
      getNetworkFees: action.bound,
      toDecimalNumber: action.bound,
      setIsLiquidated: action.bound,
      userGaveAllowance: observable,
      getRemainingDays: action.bound,
      getFeeForYear: action.bound,
      userSyncInterval: action.bound,
      approveAllowance: action.bound,
      ssvContractInstance: observable,
      activateValidator: action.bound,
      getContractAddress: action.bound,
      getAccountBurnRate: action.bound,
      clearUserSyncInterval: action.bound,
      getNewAccountBurnRate: action.bound,
      getValidatorOperators: action.bound,
      contractDepositSsvBalance: observable,
      liquidationCollateralPeriod: observable,
      getBalanceFromSsvContract: action.bound,
      prepareSsvAmountToTransfer: action.bound,
      minimumLiquidationCollateral: observable,
      getBalanceFromDepositContract: action.bound,
    });
  }

  /**
   * Returns instance of SSV contract
   */
  get ssvContract(): Contract {
    if (!this.ssvContractInstance) {
      // const walletStore: WalletStore = this.getStore('Wallet');
      this.ssvContractInstance = new ethers.Contract(
        this.getContractAddress('ssv_token'),
        config.CONTRACTS.SSV_TOKEN.ABI,
      );
    }
    return <Contract> this.ssvContractInstance;
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
    if (!this.getStore('Wallet').wallet?.provider) {
      console.warn('getNetworkFees no wallet yet');
      return;
    }
    if (!this.accountAddress) {
      console.warn('getNetworkFees no account address');
      return;
    }
    if (this.syncingUser) {
      console.warn('getNetworkFees already syncing');
      return;
    }

    this.syncingUser = true;
    try {
      console.warn('userSyncInterval before');
      // await Promise.race([
      //   Promise.all([
      //     this.getNetworkFees(),
      //     this.getBalanceFromSsvContract(),
      //     this.checkAllowance(),
      //   ]),
      //   new Promise((_, reject) => setTimeout(reject, 5000)),
      // ]);
      console.log('network fees');
      await this.getNetworkFees();
      console.log('balanceFrom');
      await this.getBalanceFromSsvContract();
      console.log('check allownace');
      await this.checkAllowance();
      console.warn('userSyncInterval after');
    } catch (e) {
      console.warn('userSyncInterval error', e);
    } finally {
      console.warn('userSyncInterval finally remove syncing flag');
      this.syncingUser = false;
    }
  }

  /**
   * Init User
   */
  async initUser() {
    this.clearUserSyncInterval();
    // setTimeout(() => {
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<userSyncInterval>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      this.userSyncInterval().finally(() => {
        this.accountInterval = setInterval(this.userSyncInterval, 15000);
      });
    // }, 1000);
  }

  clearUserSyncInterval() {
    clearInterval(this.accountInterval);
  }

  getFeeForYear = (fee: number, decimalPlaces?: number): string => {
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
      walletStore.getterContract.getOperatorsByValidator(publicKey).then((operators: any) => {
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
    return new Promise<boolean>(async (resolve) => {
      // const gasLimit = getFixedGasLimit(GasGroup.DEPOSIT);
      const walletStore: WalletStore = this.getStore('Wallet');
      const processStore: ProcessStore = this.getStore('Process');
      const clusterStore: ClusterStore = this.getStore('Cluster');
      const process: SingleCluster = processStore.getProcess;
      const cluster = process.item;
      const operatorsIds = cluster.operators.map((operator: {
        id: any;
      }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
      const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
      const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
      const tx = await walletStore.setterContract.deposit(this.accountAddress, operatorsIds, ssvAmount, clusterData);
      if (tx.hash) {
        walletStore.notifySdk.hash(tx.hash);
      }
      const receipt = await tx.wait();
      const result = receipt.blockHash;
      resolve(result);
    });
    // return new Promise<boolean>(async (resolve) => {
    //   const gasLimit = getFixedGasLimit(GasGroup.DEPOSIT);
    //   const walletStore: WalletStore = this.getStore('Wallet');
    //   const processStore: ProcessStore = this.getStore('Process');
    //   const clusterStore: ClusterStore = this.getStore('Cluster');
    //   const process: SingleCluster = processStore.getProcess;
    //   const cluster = process.item;
    //   const operatorsIds = cluster.operators.map((operator: {
    //     id: any;
    //   }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
    //   const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
    //   const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
    //   walletStore.setterContract.methods.deposit(this.accountAddress, operatorsIds, ssvAmount, clusterData).send({
    //     from: this.accountAddress,
    //     gas: gasLimit,
    //   })
    //     .on('receipt', async () => {
    //       resolve(true);
    //     })
    //     .on('transactionHash', (txHash: string) => {
    //       walletStore.notifySdk.hash(txHash);
    //     })
    //     .on('error', () => {
    //       resolve(false);
    //     });
    // });
  }

  /**
   * Check Account status
   */
  async checkIfLiquidated(): Promise<void> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      this.setIsLiquidated(await walletStore.getterContract.isLiquidated(this.accountAddress));
    } catch (e) {
      this.setIsLiquidated(false);
    }
  }

  setIsLiquidated = (status: boolean) => {
    runInAction(() => {
      this.userLiquidated = status;
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
    this.userGaveAllowance = false;
    this.contractDepositSsvBalance = 0;
    this.liquidationCollateralPeriod = 0;
  }

  /**
   * Get account balance on ssv contract
   */
  async getBalanceFromSsvContract(): Promise<any> {
    console.log('getBalanc');
    console.log(this.ssvContract);
    console.log(await this.ssvContract.balanceOf(this.accountAddress));
    const balance = await this.ssvContract.balanceOf(this.accountAddress);
    console.log('BALANCE');
    console.log(await this.ssvContract.balanceOf(this.accountAddress));
    const walletStore = this.getStore('Wallet');
    this.walletSsvBalance = parseFloat(String(walletStore.fromWei(balance, 'ether')));
  }

  /**
   * Get account balance on network contract
   */
  async getBalanceFromDepositContract(): Promise<any> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      const balance = await walletStore.getterContract.getAddressBalance(this.accountAddress);
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
   */
  async withdrawSsv(amount: string, operatorFlow: boolean = false) {
    return new Promise<boolean>(async (resolve) => {
      try {
        const walletStore: WalletStore = this.getStore('Wallet');
        const processStore: ProcessStore = this.getStore('Process');
        const clusterStore: ClusterStore = this.getStore('Cluster');
        const process: any = processStore.process;
        const eventFlow = operatorFlow ? GasGroup.WITHDRAW_OPERATOR_BALANCE : GasGroup.WITHDRAW_CLUSTER_BALANCE;
        let gasLimit = getFixedGasLimit(eventFlow);
        gasLimit;
        let tx;
        if (processStore.isValidatorFlow) {
          const cluster: SingleCluster = process.item;
          const operatorsIds = cluster.operators.map((operator: {
            id: any;
          }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
          const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
          // @ts-ignore
          const newBalance = walletStore.fromWei(cluster.balance) - Number(amount);
          if (clusterStore.getClusterRunWay({ ...process.item, balance: walletStore.toWei(newBalance) }) <= 0) {
            tx = await walletStore.setterContract.liquidate(this.accountAddress, operatorsIds, clusterData);
            if (tx.hash) {
              walletStore.notifySdk.hash(tx.hash);
            }
            const receipt = await tx.wait();
            const result = receipt.blockHash;
            resolve(result);
          } else {
            tx = await walletStore.setterContract.withdraw(operatorsIds, this.prepareSsvAmountToTransfer(walletStore.toWei(amount)), clusterData);
            if (tx.hash) {
              walletStore.notifySdk.hash(tx.hash);
            }
            const receipt = await tx.wait();
            const result = receipt.blockHash;
            resolve(result);
          }
        } else {
          const operator: SingleOperator = process.item;
          // @ts-ignore
          const operatorId = operator.id;
          const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
          tx = await walletStore.setterContract.withdrawOperatorEarnings(operatorId, ssvAmount);
          if (tx.hash) {
            walletStore.notifySdk.hash(tx.hash);
          }
          const receipt = await tx.wait();
          const result = receipt.blockHash;
          resolve(result);
        }
      } catch (e: any) {
        GoogleTagManager.getInstance().sendEvent({
          category: 'my_account',
          action: 'withdraw_tx',
          label: 'error',
        });
        resolve(false);
      }
    });
    // return new Promise<boolean>(async (resolve) => {
    //   try {
    //     const walletStore: WalletStore = this.getStore('Wallet');
    //     const processStore: ProcessStore = this.getStore('Process');
    //     const clusterStore: ClusterStore = this.getStore('Cluster');
    //     const process: any = processStore.process;
    //     const eventFlow = operatorFlow ? GasGroup.WITHDRAW_OPERATOR_BALANCE : GasGroup.WITHDRAW_CLUSTER_BALANCE;
    //     let gasLimit = getFixedGasLimit(eventFlow);
    //     let contractFunction: null;
    //     if (processStore.isValidatorFlow) {
    //       const cluster: SingleCluster = process.item;
    //       const operatorsIds = cluster.operators.map((operator: {
    //         id: any;
    //       }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
    //       const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
    //       // @ts-ignore
    //       const newBalance = walletStore.fromWei(cluster.balance) - Number(amount);
    //       if (clusterStore.getClusterRunWay({ ...process.item, balance: walletStore.toWei(newBalance) }) <= 0) {
    //         gasLimit = getLiquidationGasLimit(cluster.operators.length);
    //         contractFunction = walletStore.setterContract.methods.liquidate(this.accountAddress, operatorsIds, clusterData);
    //       } else {
    //         contractFunction = walletStore.setterContract.methods.withdraw(operatorsIds, this.prepareSsvAmountToTransfer(walletStore.toWei(amount)), clusterData);
    //       }
    //     } else {
    //       const operator: SingleOperator = process.item;
    //       // @ts-ignore
    //       const operatorId = operator.id;
    //       const ssvAmount = this.prepareSsvAmountToTransfer(walletStore.toWei(amount));
    //       contractFunction = walletStore.setterContract.methods.withdrawOperatorEarnings(operatorId, ssvAmount);
    //     }
    //     // @ts-ignore
    //     contractFunction.send({ from: this.accountAddress, gas: gasLimit })
    //       .on('receipt', async () => {
    //         GoogleTagManager.getInstance().sendEvent({
    //           category: 'my_account',
    //           action: 'withdraw_tx',
    //           label: 'success',
    //         });
    //         resolve(true);
    //       })
    //       .on('transactionHash', (txHash: string) => {
    //         walletStore.notifySdk.hash(txHash);
    //       })
    //       .on('error', () => {
    //         GoogleTagManager.getInstance().sendEvent({
    //           category: 'my_account',
    //           action: 'withdraw_tx',
    //           label: 'error',
    //         });
    //         resolve(false);
    //       });
    //   } catch (e: any) {
    //     console.log('<<<<<<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>>>>>>');
    //     console.log(e.message);
    //     console.log('<<<<<<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>>>>>>');
    //     resolve(false);
    //   }
    // });
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
      walletStore.setterContract.methods.reactivateAccount(ssvAmount).send({ from: this.accountAddress })
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
    // console.warn('[DIRECT] checkAllowance before');
    // const provider = 'https://ethereum-holesky.publicnode.com';
    // const web3Provider = new Web3.providers.HttpProvider(provider);
    // const web3 = new Web3(web3Provider);
    // const contract = new web3.eth.Contract(
    //   config.CONTRACTS.SSV_TOKEN.ABI,
    //   this.getContractAddress('ssv_token'),
    // );
    // const customAllowance = await contract.methods.allowance(
    //   // @ts-ignore
    //   this.accountAddress,
    //   // @ts-ignore
    //   this.getContractAddress('ssv_network_setter'),
    // ).call();
    //
    // console.warn({
    //   allowance: customAllowance,
    // });
    // console.warn('[DIRECT] checkAllowance after');

    console.warn('checkAllowance before');
    const allowance = await this.ssvContract
      .allowance(
        this.accountAddress,
        this.getContractAddress('ssv_network_setter'),
      );
    this.approvedAllowance = allowance;
    this.userGaveAllowance = allowance !== '0';
  }

  /**
   * Set allowance to get CDT from user account.
   */
  async approveAllowance(estimate: boolean = false, callBack?: () => void): Promise<any> {
    estimate;
    return new Promise((async (resolve) => {
      const weiValue = String('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // amount ? this.getStore('Wallet').web3.utils.toWei(ssvValue, 'ether') : ssvValue;
      const walletStore: WalletStore = this.getStore('Wallet');

      try {
        const tx = await this.ssvContract.approve(this.getContractAddress('ssv_network_setter'), weiValue);
        if (tx.hash) {
          callBack && callBack();
          walletStore.notifySdk.hash(tx.hash);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          this.userGaveAllowance = true;
          resolve(true);
        }
      } catch (e: any) {
        console.debug('Contract Error', e);
        resolve(false);
        this.userGaveAllowance = false;
      }
    }));
    // return new Promise((resolve => {
    //   const ssvValue = String('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    //   const weiValue = ssvValue; // amount ? this.getStore('Wallet').web3.utils.toWei(ssvValue, 'ether') : ssvValue;
    //   const walletStore: WalletStore = this.getStore('Wallet');
    //
    //   if (!estimate) {
    //     console.debug('Approving:', { ssvValue, weiValue });
    //   }
    //
    //   const methodCall = this.ssvContract
    //     .methods
    //     .approve(this.getContractAddress('ssv_network_setter'), weiValue);
    //
    //   if (estimate) {
    //     return methodCall
    //       .estimateGas({ from: this.accountAddress })
    //       .then((gasAmount: number) => {
    //         const floatString = this.getStore('Wallet').web3.utils.fromWei(walletStore.BN(gasAmount).toString(), 'ether');
    //         return parseFloat(floatString);
    //       });
    //   }
    //
    //   return methodCall
    //     .send({ from: this.accountAddress })
    //     .on('receipt', async () => {
    //       resolve(true);
    //       this.userGaveAllowance = true;
    //     })
    //     .on('transactionHash', (txHash: string) => {
    //       callBack && callBack();
    //       walletStore.notifySdk.hash(txHash);
    //     })
    //     .on('error', (error: any) => {
    //       console.debug('Contract Error', error);
    //       resolve(false);
    //       this.userGaveAllowance = false;
    //     });
    // }));
  }

  /**
   * Get network fee
   */
  async getNetworkFees() {
    const walletStore: WalletStore = this.getStore('Wallet');
    const networkContract = walletStore.getterContract;

    if (!networkContract)  {
      console.warn('getNetworkFees no network contract yet');
      return;
    }

    console.warn('getNetworkFees 1');
    const liquidationCollateral = await networkContract.getLiquidationThresholdPeriod();
    console.warn('getNetworkFees 2');
    const networkFee = await networkContract.getNetworkFee();
    console.warn('getNetworkFees 3');
    const minimumLiquidationCollateral = await networkContract.getMinimumLiquidationCollateral();
    console.warn('getNetworkFees 4');
    // hardcoded should be replaced
    this.networkFee = walletStore.fromWei(networkFee);
    console.warn({
      notNativeNetworkFee: this.networkFee,
    });
    this.liquidationCollateralPeriod = Number(liquidationCollateral);
    this.minimumLiquidationCollateral = walletStore.fromWei(minimumLiquidationCollateral);
  }

  /**
   * Get account burn rate
   */
  async getAccountBurnRate(): Promise<void> {
    try {
      const walletStore: WalletStore = this.getStore('Wallet');
      const burnRate = await walletStore.getterContract.getAddressBurnRate(this.accountAddress);
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
}

export default SsvStore;
