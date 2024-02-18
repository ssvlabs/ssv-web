import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import ProcessStore, { SingleCluster, SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import notifyService from '~root/services/notify.service';

const MAX_WEI_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

class SsvStore extends BaseStore {
  accountInterval: any = null;
  feesInterval: any = null;
  // Balances
  walletSsvBalance: number = 0;
  contractDepositSsvBalance: number = 0;
  approvedAllowance: number = 0;

  // Calculation props
  networkFee: number = 0;
  accountBurnRate: number = 0;
  liquidationCollateralPeriod: number = 0;
  minimumLiquidationCollateral: number = 0;

  constructor() {
    super();
    makeObservable(this, {
      deposit: action.bound,
      initUser: action.bound,
      networkFee: observable,
      accountAddress: computed,
      withdrawSsv: action.bound,
      clearSettings: action.bound,
      accountInterval: observable,
      feesInterval: observable,
      accountBurnRate: observable,
      walletSsvBalance: observable,
      approvedAllowance: observable,
      checkAllowance: action.bound,
      getNetworkFeeAndLiquidationCollateralParams: action.bound,
      getRemainingDays: action.bound,
      requestAllowance: action.bound,
      getAccountBurnRate: action.bound,
      clearUserSyncInterval: action.bound,
      getNewAccountBurnRate: action.bound,
      contractDepositSsvBalance: observable,
      liquidationCollateralPeriod: observable,
      getBalanceFromSsvContract: action.bound,
      minimumLiquidationCollateral: observable,
    });
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
   * Init User
   */
  async initUser() {
    // TODO: do it only before interaction with the contract
    this.clearUserSyncInterval();
    setTimeout(async () => {
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<userSyncInterval>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      this.feesInterval = setInterval(this.getNetworkFeeAndLiquidationCollateralParams, 86400000); // once in 24 hours
      this.accountInterval = setInterval(this.getBalanceFromSsvContract, 10000);
      await this.getNetworkFeeAndLiquidationCollateralParams();
      await this.getBalanceFromSsvContract();
    }, 5000);
  }

  clearUserSyncInterval() {
    clearInterval(this.accountInterval);
    clearInterval(this.feesInterval);
  }

  /**
   * Deposit ssv
   * @param amount
   */
  async deposit(amount: string) {
    return new Promise<boolean>(async (resolve) => {
      // const gasLimit = getFixedGasLimit(GasGroup.DEPOSIT);
      const processStore: ProcessStore = this.getStore('Process');
      const clusterStore: ClusterStore = this.getStore('Cluster');
      const process: SingleCluster = processStore.getProcess;
      const cluster = process.item;
      const contract = getContractByName(EContractName.SETTER);
      const operatorsIds = cluster.operators.map((operator: {
        id: any;
      }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
      const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
      const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
      const tx = await contract.deposit(this.accountAddress, operatorsIds, ssvAmount, clusterData);
      if (tx.hash) {
        notifyService.hash(tx.hash);
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
    //   const ssvAmount = this.prepareSsvAmountToTransfer(toWei(amount));
    //   walletStore.setterContract.methods.deposit(this.accountAddress, operatorsIds, ssvAmount, clusterData).send({
    //     from: this.accountAddress,
    //     gas: gasLimit,
    //   })
    //     .on('receipt', async () => {
    //       resolve(true);
    //     })
    //     .on('transactionHash', (txHash: string) => {
    //       notifyService.hash(tx.hash);
    //     })
    //     .on('error', () => {
    //       resolve(false);
    //     });
    // });
  }

  /**
   * Init settings
   */
  clearSettings() {
    this.networkFee = 0;
    this.accountBurnRate = 0;
    this.walletSsvBalance = 0;
    this.contractDepositSsvBalance = 0;
    this.liquidationCollateralPeriod = 0;
  }

  /**
   * Get account balance on ssv contract
   */
  async getBalanceFromSsvContract(): Promise<any> {
    console.warn('getBalanceFromSsvContract before');
    try {
      const ssvContract = getContractByName(EContractName.TOKEN);
      if (!ssvContract) return;
      const balance = await ssvContract.balanceOf(this.accountAddress);
      this.walletSsvBalance = parseFloat(String(fromWei(balance)));
      console.warn('getBalanceFromSsvContract after');
    } catch (e) {
      console.warn('getBalanceFromSsvContract error', e);
    }
  }

  /**
   * Withdraw ssv
   * @param amount
   */
  async withdrawSsv(amount: string) { // , operatorFlow: boolean = false) {
    return new Promise<boolean>(async (resolve) => {
      try {
        const processStore: ProcessStore = this.getStore('Process');
        const clusterStore: ClusterStore = this.getStore('Cluster');
        const process: any = processStore.process;
        // const eventFlow = operatorFlow ? GasGroup.WITHDRAW_OPERATOR_BALANCE : GasGroup.WITHDRAW_CLUSTER_BALANCE;
        const contract = getContractByName(EContractName.SETTER);
        // let gasLimit = getFixedGasLimit(eventFlow);
        let tx;
        if (processStore.isValidatorFlow) {
          const cluster: SingleCluster = process.item;
          const operatorsIds = cluster.operators.map((operator: {
            id: any;
          }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
          const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));
          // @ts-ignore
          const newBalance = fromWei(cluster.balance) - Number(amount);
          if (clusterStore.getClusterRunWay({ ...process.item, balance: toWei(newBalance) }) <= 0) {
            tx = await contract.liquidate(this.accountAddress, operatorsIds, clusterData);
            if (tx.hash) {
              notifyService.hash(tx.hash);
            }
            const receipt = await tx.wait();
            const result = receipt.blockHash;
            resolve(result);
          } else {
            tx = await contract.withdraw(operatorsIds, prepareSsvAmountToTransfer(toWei(amount)), clusterData);
            if (tx.hash) {
              notifyService.hash(tx.hash);
            }
            const receipt = await tx.wait();
            const result = receipt.blockHash;
            resolve(result);
          }
        } else {
          const operator: SingleOperator = process.item;
          // @ts-ignore
          const operatorId = operator.id;
          const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
          tx = await contract.withdrawOperatorEarnings(operatorId, ssvAmount);
          if (tx.hash) {
            notifyService.hash(tx.hash);
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
    //       const newBalance = fromWei(cluster.balance) - Number(amount);
    //       if (clusterStore.getClusterRunWay({ ...process.item, balance: toWei(newBalance) }) <= 0) {
    //         gasLimit = getLiquidationGasLimit(cluster.operators.length);
    //         contractFunction = walletStore.setterContract.methods.liquidate(this.accountAddress, operatorsIds, clusterData);
    //       } else {
    //         contractFunction = walletStore.setterContract.methods.withdraw(operatorsIds, this.prepareSsvAmountToTransfer(toWei(amount)), clusterData);
    //       }
    //     } else {
    //       const operator: SingleOperator = process.item;
    //       // @ts-ignore
    //       const operatorId = operator.id;
    //       const ssvAmount = this.prepareSsvAmountToTransfer(toWei(amount));
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
    //         notifyService.hash(tx.hash);
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
   *  Call userAllowance function in order to know if it has been set or not for SSV contract by user account.
   */
  async checkAllowance(): Promise<void> {
    try {
      const ssvContract = getContractByName(EContractName.TOKEN);
      if (!ssvContract) return;
      console.warn('checkAllowance before');
      const allowance = await ssvContract.allowance(this.accountAddress, config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS);
      this.approvedAllowance = allowance || 0;
      console.warn('checkAllowance after');
    } catch (e) {
      console.warn('checkAllowance error', e);
    }
  }

  /**
   * Request for MAX_WEI_AMOUNT, user can change so actual approved allowance is saved
   */
  async requestAllowance(callBack?: CallableFunction): Promise<any> {
    return new Promise((async (resolve, reject) => {
      try {
        const ssvContract = getContractByName(EContractName.TOKEN);
        const tx = await ssvContract.approve(config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS, MAX_WEI_AMOUNT);
        if (tx.hash) {
          callBack && callBack({ txHash: tx.hash });
        } else {
          reject();
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          this.approvedAllowance = Number(receipt.approvedAllowance);
          resolve(true);
        }
      } catch (e: any) {
        console.debug('Contract Error', e);
        this.approvedAllowance = 0;
        reject();
      }
    }));
  }

  async getNetworkFeeAndLiquidationCollateralParams() {
    console.warn('getNetworkFeeAndLiquidationCollateralParams called');
    try {
      const contract = getContractByName(EContractName.GETTER);
      if (!contract) return;

      if (this.networkFee === 0) {
        this.networkFee = fromWei(await contract.getNetworkFee());
      }

      if (this.liquidationCollateralPeriod === 0) {
        this.liquidationCollateralPeriod = Number(await contract.getLiquidationThresholdPeriod());
      }

      if (this.minimumLiquidationCollateral === 0) {
        this.minimumLiquidationCollateral = fromWei(await contract.getMinimumLiquidationCollateral());
      }
    } catch (e) {
      console.warn('getNetworkFeeAndLiquidationCollateralParams error', e);
    }
  }

  /**
   * Get account burn rate
   */
  async getAccountBurnRate(): Promise<void> {
    try {
      const contract = getContractByName(EContractName.GETTER);
      const burnRate = await contract.getAddressBurnRate(this.accountAddress);
      this.accountBurnRate = fromWei(burnRate);
    } catch (e: any) {
      // TODO: handle error
      console.error(e.message);
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
