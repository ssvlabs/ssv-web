import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { fromWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { store } from '~app/store';

const MAX_WEI_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

class SsvStore extends BaseStore {
  accountInterval: any = null;
  feesInterval: any = null;
  // Balances
  walletSsvBalance: number = 0;
  approvedAllowance: number = 0;

  // Calculation props
  networkFee: number = 0;
  liquidationCollateralPeriod: number = 0;
  minimumLiquidationCollateral: number = 0;

  constructor() {
    super();
    makeObservable(this, {
      initUser: action.bound,
      networkFee: observable,
      clearSettings: action.bound,
      accountInterval: observable,
      feesInterval: observable,
      walletSsvBalance: observable,
      approvedAllowance: observable,
      checkAllowance: action.bound,
      getNetworkFeeAndLiquidationCollateral: action.bound,
      requestAllowance: action.bound,
      clearUserSyncInterval: action.bound,
      liquidationCollateralPeriod: observable,
      getBalanceFromSsvContract: action.bound,
      minimumLiquidationCollateral: observable,
    });
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
   * Init settings
   */
  clearSettings() {
    this.networkFee = 0;
    this.walletSsvBalance = 0;
    this.liquidationCollateralPeriod = 0;
    this.approvedAllowance = 0;
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
}

export default SsvStore;
