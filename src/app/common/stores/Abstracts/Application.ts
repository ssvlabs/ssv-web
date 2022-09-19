import { Theme } from '@material-ui/core/styles';
import config from '~app/common/config';

export default abstract class Application {
  theme: Theme;
  appTitle: string;
  darkMode: boolean;
  isLoading: boolean;
  strategyName: string;
  strategyRedirect: string;
  txHash: string | undefined;
  userGeo: string | undefined;
  locationRestrictionEnabled: boolean = false;

  protected constructor(theme: Theme, darkMode: boolean) {
    this.txHash = '';
    this.theme = theme;
    this.isLoading = false;
    this.userGeo = undefined;
    this.darkMode = darkMode;
    this.strategyName = 'Distribution';
    this.appTitle = 'SSV Network Testnet Distribution';
    this.strategyRedirect = config.routes.DISTRIBUTION.ROOT;
  }

  // eslint-disable-next-line no-unused-vars
  public abstract setIsLoading(status: boolean): void;

  // eslint-disable-next-line no-unused-vars
  public abstract showWalletPopUp(status: boolean): void;

  // eslint-disable-next-line no-unused-vars
  public abstract showTransactionPendingPopUp(status: boolean): void;

  public abstract switchDarkMode(): void;

  public abstract applicationRoutes(): any;
}
