import { Theme } from '@material-ui/core/styles';

export default abstract class Application {
    theme: Theme;
    darkMode: boolean;
    isLoading: boolean;
    strategyName: string;
    strategyRedirect: string;

    protected constructor(theme: Theme, darkMode: boolean) {
        this.theme = theme;
        this.isLoading = false;
        this.darkMode = darkMode;
        this.strategyName = 'Distribution';
        this.strategyRedirect = '/dashboard';
    }

    // eslint-disable-next-line no-unused-vars
    public abstract setIsLoading(status: boolean): void;
    // eslint-disable-next-line no-unused-vars
    public abstract showTransactionPendingPopUp(status: boolean): void;
    public abstract switchDarkMode(): void;
    public abstract applicationRoutes(): any;
}
