import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Grid, MuiThemeProvider } from '@material-ui/core';
import { BrowserView, MobileView } from 'react-device-detect';
import { useStyles } from '~app/App.styles';
import { globalStyle } from '~app/globalStyle';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import Routes from '~app/Routes/Routes';
// import BarMessage from '~app/common/components/BarMessage';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import MobileNotSupported from '~app/components/MobileNotSupported';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const App = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const GlobalStyle = globalStyle();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        walletStore.connectWalletFromCache();
    }, []);

    useEffect(() => {
        if (walletStore.accountDataLoaded) {
            history.push(applicationStore.strategyRedirect);
        }
    }, [walletStore.accountDataLoaded]);
    // console.log(walletStore.web3 && walletStore.encodeKey('LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBeFNyUGZZNWhlSVpMenFpNG5YdHIKZVRyeTRuMWJ6V2xWWUJWdmNHWGZpWWdQRXcwaG9jeStzTlFnZ3JIN2VqVUVPbWtlcGpMdmU1czBjMXcxVjhMRwoxandNaFZkRUtWVjVSTmJTbDB2OVFvOXVsSFFwZFZXMDZjakJNZ0xZczUyd3pyZ1gwYTAvNHhZUk1RMGtxMUMxCjg5Yk16eXJVakd4alNTMncvY3FHT0NLb2UvdnpRdjI1UVNvUzVoK1FZUEhqa3pZcDJkMkFXYzNmbGhKMGROWkoKV2xjU3dZbXlnWXdPRWsyT044dTFkSlBCSWlURDJHQUthNVR2cTZudGxhWU5PbzVVUk5iZStIYUFGRmxXWG01aQpVb1BtUi9CNWFYcDhUVk54Z1AwVXUwVGdjUUpicU4zRXp2TEl5NHVBRWlnWGdmcUNMSm5QOURPVmxuTWMvQUJiCk53SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K'));
    return (
      <MuiThemeProvider theme={applicationStore.theme}>
        <GlobalStyle />
        {!walletStore.accountDataLoaded && (
          <Grid container className={classes.LoaderWrapper}>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
        )}
        {/* <BarMessage /> */}
        <AppBar />
        <BrowserView>
          <Routes />
        </BrowserView>
        <MobileView>
          <MobileNotSupported />
        </MobileView>
        <CssBaseline />
      </MuiThemeProvider>
    );
};

export default observer(App);
