import { action, computed, observable } from 'mobx';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import BaseStore from '~app/common/stores/BaseStore';
import { AppTheme } from '~root/Theme';
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
  
  @observable toolBarMenu: boolean = false;

  // @ts-ignore
  @observable theme: Theme;
  @observable darkMode: boolean = false;

  constructor() {
    super();
    const darkModeSaved = this.localStorage.getItem('isDarkMode');
    if (darkModeSaved) {
      this.darkMode = darkModeSaved === '1';
      this.switchDarkMode(this.darkMode);
    } else {
      this.switchDarkMode(false);
    }
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

  @action.bound
  switchDarkMode(isDarkMode?: boolean) {
    this.darkMode = isDarkMode ?? !this.darkMode;
    this.localStorage.setItem('isDarkMode', this.darkMode ? '1' : '0');
    this.theme = createMuiTheme(AppTheme({ isDarkMode: this.isDarkMode }));
  }

  @computed
  get isDarkMode() {
    return this.darkMode;
  }

  get muiTheme(): Theme {
    return this.theme;
  }
  
  @action.bound
  setIsLoading(status: boolean) {
    this.isShowingLoading = status;
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
  get isLoading() {
    return this.isShowingLoading;
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
