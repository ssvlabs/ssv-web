import { action, computed, observable } from 'mobx';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { AppTheme } from '~root/Theme';
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
  @observable theme: Theme;
  @observable userGeo: string = '';
  @observable darkMode: boolean = false;
  @observable toolBarMenu: boolean = false;
  @observable walletPopUp: boolean = false;
  @observable strategyName: string = 'ssv-web';
  @observable isShowingLoading: boolean = false;
  @observable runningProcess: string = 'ssv-web';
  @observable walletConnectivity: boolean = false;
  @observable whiteNavBarBackground: boolean = false;
  @observable transactionPendingPopUp: boolean = false;
  @observable strategyRedirect: string = process.env.REACT_APP_NEW_STAGE ? '/dashboard' : '/';

  constructor() {
    super();
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

  @action.bound
  setApplicationProcess(process: string) {
    this.runningProcess = process;
  }

  @action.bound
  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
  }

  @action.bound
  setWhiteNavBarBackground(status: boolean) {
    this.whiteNavBarBackground = status;
  }

  @action.bound
  cancelProcess() {
    const validatorStore: ValidatorStore = this.getStore('Validator');
    validatorStore.clearValidatorData();
    this.runningProcess = '';
  }

  @action.bound
  switchDarkMode(isDarkMode?: boolean) {
    this.darkMode = isDarkMode ?? !this.darkMode;
    const walletStore: WalletStore = this.getStore('Wallet');
    walletStore.onboardSdk.config({ darkMode: isDarkMode });
    this.localStorage.setItem('isDarkMode', this.darkMode ? '1' : '0');
    this.theme = createMuiTheme(AppTheme({ isDarkMode: this.isDarkMode }));
  }

  @action.bound
  displayToolBarMenu(status: boolean) {
    this.toolBarMenu = status;
  }

  @action.bound
  showTransactionPendingPopUp(status: boolean) {
    this.transactionPendingPopUp = status;
  }

  @action.bound
  applicationRoutes() {
    return require('~app/common/stores/applications/SsvWeb/Routes.tsx').default;
  }

  @action.bound
  showWalletPopUp(status: boolean) {
    this.walletPopUp = status;
  }

  @action.bound
  setWalletConnectivity(show: boolean) {
    this.walletConnectivity = show;
  }

  @computed
  get localStorage() {
    try {
      return localStorage;
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

  @computed
  get isLoading() {
    return this.isShowingLoading;
  }

  @computed
  get isDarkMode() {
    return this.darkMode;
  }
}

export default ApplicationStore;