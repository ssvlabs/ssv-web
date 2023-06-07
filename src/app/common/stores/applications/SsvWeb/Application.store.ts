import { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { action, computed, makeObservable, observable } from 'mobx';
import { AppTheme } from '~root/Theme';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Application from '~app/common/stores/Abstracts/Application';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class ApplicationStore extends BaseStore implements Application {
  // @ts-ignore
  theme: Theme;
  txHash: string = '';
  userGeo: string = '';
  darkMode: boolean = false;
  toolBarMenu: boolean = false;
  walletPopUp: boolean = false;
  strategyName: string = 'ssv-web';
  isShowingLoading: boolean = false;
  runningProcess: string = 'ssv-web';
  walletConnectivity: boolean = false;
  whiteNavBarBackground: boolean = false;
  transactionPendingPopUp: boolean = false;
  appTitle: string = 'SSV Network Testnet';
  strategyRedirect: string = config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
  locationRestrictionEnabled: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      theme: observable,
      txHash: observable,
      userGeo: observable,
      isLoading: computed,
      darkMode: observable,
      appTitle: observable,
      isDarkMode: computed,
      localStorage: computed,
      toolBarMenu: observable,
      walletPopUp: observable,
      strategyName: observable,
      runningProcess: observable,
      setIsLoading: action.bound,
      cancelProcess: action.bound,
      strategyRedirect: observable,
      isShowingLoading: observable,
      switchDarkMode: action.bound,
      showWalletPopUp: action.bound,
      walletConnectivity: observable,
      applicationRoutes: action.bound,
      setTransactionHash: action.bound,
      displayToolBarMenu: action.bound,
      whiteNavBarBackground: observable,
      transactionPendingPopUp: observable,
      setApplicationProcess: action.bound,
      setWalletConnectivity: action.bound,
      setWhiteNavBarBackground: action.bound,
      showTransactionPendingPopUp: action.bound,
    });

    const darkModeSaved = this.localStorage.getItem('isDarkMode');
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
    if (darkModeSaved) {
      this.darkMode = darkModeSaved === '1';
      this.switchDarkMode(this.darkMode);
    } else if (isDark) {
      this.switchDarkMode(true);
    } else {
      this.switchDarkMode(false);
    }
  }

  setApplicationProcess(process: string) {
    this.runningProcess = process;
  }

  setTransactionHash(txHash: string) {
    this.txHash = txHash;
  }

  showTransactionPendingPopUp(status: boolean) {
    this.transactionPendingPopUp = status;
  }

  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
  }

  setWhiteNavBarBackground(status: boolean) {
    this.whiteNavBarBackground = status;
  }

  cancelProcess() {
    const validatorStore: ValidatorStore = this.getStore('Validator');
    validatorStore.clearKeyStoreFlowData();
    this.runningProcess = '';
  }

  switchDarkMode(isDarkMode?: boolean) {
    this.darkMode = isDarkMode ?? !this.darkMode;
    const walletStore: WalletStore = this.getStore('Wallet');
    walletStore.onboardSdk.config({ darkMode: isDarkMode });
    this.localStorage.setItem('isDarkMode', this.darkMode ? '1' : '0');
    this.theme = createTheme(AppTheme({ isDarkMode: this.isDarkMode }));
  }

  displayToolBarMenu(status: boolean) {
    this.toolBarMenu = status;
  }

  applicationRoutes() {
    try {
      return require('~app/common/stores/applications/SsvWeb/Routes').default;
    } catch (e: any) {
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<applicationRoutes>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(e.message);
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<applicationRoutes>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    }
  }

  showWalletPopUp(status: boolean) {
    this.walletPopUp = status;
  }

  setWalletConnectivity(show: boolean) {
    this.walletConnectivity = show;
  }

  get localStorage() {
    try {
      return window.localStorage;
    } catch (e) {
      return {
        getItem(key: string): string | null {
          return key;
        },
        setItem(key: string, value: string) {
          return {
            key,
            value,
          };
        },
      };
    }
  }

  get isLoading() {
    return this.isShowingLoading;
  }

  get isDarkMode() {
    return this.darkMode;
  }
}

export default ApplicationStore;
