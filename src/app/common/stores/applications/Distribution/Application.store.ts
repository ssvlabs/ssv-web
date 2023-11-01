import { createTheme, Theme } from '@mui/material/styles';
import { action, computed, makeObservable, observable } from 'mobx';
import { AppTheme } from '~root/Theme';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Application from '~app/common/stores/Abstracts/Application';

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
  isShowingLoading: boolean = false;
  walletConnectivity: boolean = false;
  strategyName: string = 'distribution';
  transactionPendingPopUp: boolean = false;
  appTitle: string = 'SSV Network Distribution';
  strategyRedirect: string = config.routes.DISTRIBUTION.ROOT;
  locationRestrictionEnabled: boolean = false;

  constructor() {
    super();

    makeObservable(this, {
      theme: observable,
      txHash: observable,
      userGeo: observable,
      isLoading: computed,
      appTitle: observable,
      darkMode: observable,
      isDarkMode: computed,
      localStorage: computed,
      toolBarMenu: observable,
      walletPopUp: observable,
      strategyName: observable,
      setIsLoading: action.bound,
      isShowingLoading: observable,
      strategyRedirect: observable,
      switchDarkMode: action.bound,
      showWalletPopUp: action.bound,
      walletConnectivity: observable,
      applicationRoutes: action.bound,
      displayToolBarMenu: action.bound,
      transactionPendingPopUp: observable,
      setWalletConnectivity: action.bound,
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

  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
  }

  switchDarkMode(isDarkMode?: boolean) {
    this.darkMode = isDarkMode ?? !this.darkMode;
    const walletStore: WalletStore = this.getStore('Wallet');
    const theme = isDarkMode ? 'dark' : 'light';
    walletStore?.onboardSdk?.state.actions.updateTheme(theme);
    this.localStorage.setItem('isDarkMode', this.darkMode ? '1' : '0');
    this.theme = createTheme(AppTheme({ isDarkMode: this.isDarkMode }));
  }

  displayToolBarMenu(status: boolean) {
    this.toolBarMenu = status;
  }

  applicationRoutes() {
    return require('~app/common/stores/applications/Distribution/Routes').default;
  }

  showTransactionPendingPopUp(status: boolean) {
    this.transactionPendingPopUp = status;
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
