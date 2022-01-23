import { action, computed, observable } from 'mobx';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import BaseStore from '~app/common/stores/BaseStore';
import { AppTheme } from '~root/Theme';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import NotificationsStore from '~app/common/stores/Notifications.store';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class ApplicationStore extends BaseStore {
  @observable isShowingLoading: boolean = false;
  @observable walletPopUp: boolean = false;
  @observable walletConnectivity: boolean = false;
  @observable transactionPendingPopUp: boolean = false;

  private walletStore: WalletStore = this.getStore('Wallet');

  // @ts-ignore
  @observable theme: Theme;
  @observable darkMode: boolean = false;

  @observable toolBarMenu: boolean = false;

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
  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
  }

  @action.bound
  switchDarkMode(isDarkMode?: boolean) {
    this.darkMode = isDarkMode ?? !this.darkMode;
    this.walletStore.onboardSdk.config({ darkMode: isDarkMode });
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
  get muiTheme(): Theme {
    return this.theme;
  }

  @computed
  get isDarkMode() {
    return this.darkMode;
  }

  @computed
  get shouldDisplayToolBar() {
    return this.toolBarMenu;
  }

  /**
   * Handle error appeared in any of the stores
   * @param error
   * @param args
   */
  displayUserError(error: any, ...args: any) {
    if (error?.message) {
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      notificationsStore.showMessage(error?.message, 'error');
      console.debug('Error Occurred:', { error, ...args });
      this.setIsLoading(false);
    }
  }
}

export default ApplicationStore;
