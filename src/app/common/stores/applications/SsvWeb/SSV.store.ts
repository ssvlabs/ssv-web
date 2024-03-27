import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { getClusterData, getClusterHash, getClusterRunWay } from '~root/services/cluster.service';
import { SingleCluster, SingleOperator } from '~app/model/processes.model';
import { store } from '~app/store';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';

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
      withdrawSsv: action.bound,
      clearSettings: action.bound,
      accountInterval: observable,
      feesInterval: observable,
      accountBurnRate: observable,
      walletSsvBalance: observable,
      approvedAllowance: observable,
      checkAllowance: action.bound,
      getNetworkFeeAndLiquidationCollateral: action.bound,
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
    this.clearUserSyncInterval();
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<userSyncInterval>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      this.feesInterval = setInterval(this.getNetworkFeeAndLiquidationCollateral, 86400000); // once in 24 hours
      this.accountInterval = setInterval(this.getBalanceFromSsvContract, 10000);
      await this.getNetworkFeeAndLiquidationCollateral();
      await this.getBalanceFromSsvContract();
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
      const processStore: ProcessStore = this.getStore('Process');
      const isContractWallet = store.getState().walletState.isContractWallet;
      const accountAddress = store.getState().walletState.accountAddress;
      const process: SingleCluster = processStore.getProcess;
      const cluster = process.item;
      const contract = getContractByName(EContractName.SETTER);
      const operatorsIds = cluster.operators.map((operator: {
        id: any;
      }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
      const clusterData = await getClusterData(getClusterHash(cluster.operators, accountAddress), this.liquidationCollateralPeriod, this.minimumLiquidationCollateral);
      const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
      const tx = await contract.deposit(accountAddress, operatorsIds, ssvAmount, clusterData);
      if (tx.hash && isContractWallet) {
        store.dispatch(setIsShowTxPendingPopup(true));
        resolve(true);
      } else {
        store.dispatch(setIsShowTxPendingPopup(true));
        store.dispatch(setTxHash(tx.hash));
      }
      const receipt = await tx.wait();
      const result = receipt.blockHash;
      resolve(result);
    });
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
      const ssvContract = getContractByName(EContractName.TOKEN_GETTER);
      if (!ssvContract) return;
      const accountAddress = store.getState().walletState.accountAddress;
      const balance = await ssvContract.balanceOf(accountAddress);
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
        const accountAddress = store.getState().walletState.accountAddress;
        const isContractWallet = store.getState().walletState.isContractWallet;
        const process: any = processStore.process;
        // const eventFlow = operatorFlow ? GasGroup.WITHDRAW_OPERATOR_BALANCE : GasGroup.WITHDRAW_CLUSTER_BALANCE;
        const contract = getContractByName(EContractName.SETTER);
        if (!contract) {
          resolve(false);
        }
        // let gasLimit = getFixedGasLimit(eventFlow);
        let tx;
        if (processStore.isValidatorFlow) {
          const cluster: SingleCluster = process.item;
          const operatorsIds = cluster.operators.map((operator: {
            id: any;
          }) => operator.id).map(Number).sort((a: number, b: number) => a - b);
          const clusterData = await getClusterData(getClusterHash(cluster.operators, accountAddress), this.liquidationCollateralPeriod, this.minimumLiquidationCollateral);
          // @ts-ignore
          const newBalance = fromWei(cluster.balance) - Number(amount);
          if (getClusterRunWay({ ...process.item, balance: toWei(newBalance) }, this.liquidationCollateralPeriod, this.minimumLiquidationCollateral) <= 0) {
            tx = await contract.liquidate(accountAddress, operatorsIds, clusterData);
            if (tx.hash && isContractWallet) {
              store.dispatch(setIsShowTxPendingPopup(true));
              resolve(true);
            } else {
              store.dispatch(setIsShowTxPendingPopup(true));
              store.dispatch(setTxHash(tx.hash));
            }
            const receipt = await tx.wait();
            const result = receipt.blockHash;
            resolve(result);
          } else {
            tx = await contract.withdraw(operatorsIds, prepareSsvAmountToTransfer(toWei(amount)), clusterData);
            if (tx.hash && isContractWallet) {
              store.dispatch(setIsShowTxPendingPopup(true));
              resolve(true);
            } else {
              store.dispatch(setIsShowTxPendingPopup(true));
              store.dispatch(setTxHash(tx.hash));
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
          if (tx.hash && isContractWallet) {
            store.dispatch(setIsShowTxPendingPopup(true));
            resolve(true);
          } else {
            store.dispatch(setTxHash(tx.hash));
            store.dispatch(setIsShowTxPendingPopup(true));
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
      const accountAddress = store.getState().walletState.accountAddress;
      const ssvContract = getContractByName(EContractName.TOKEN_GETTER);
      if (!ssvContract) return;
      console.warn('checkAllowance before');
      const allowance = await ssvContract.allowance(accountAddress, config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS);
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
        const ssvContract = getContractByName(EContractName.TOKEN_SETTER);
        if (!ssvContract) {
          resolve(false);
        }
        const tx = await ssvContract.approve(config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS, String(MAX_WEI_AMOUNT));
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

  async getNetworkFeeAndLiquidationCollateral() {
    console.warn('getNetworkFeeAndLiquidationCollateral called');
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
      console.warn('getNetworkFeeAndLiquidationCollateral error', e);
    }
  }

  /**
   * Get account burn rate
   */
  async getAccountBurnRate(): Promise<void> {
    try {
      const accountAddress = store.getState().walletState.accountAddress;
      const contract = getContractByName(EContractName.GETTER);
      const burnRate = await contract.getAddressBurnRate(accountAddress);
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
