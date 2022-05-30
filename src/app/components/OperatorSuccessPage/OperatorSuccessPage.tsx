import React from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/common/components/LinkText';
import ImageDiv from '~app/common/components/ImageDiv';
import { useStyles } from './OperatorSuccessPage.styles';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import PrimaryButton from '~app/common/components/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

const SetOperatorFee = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;

    const copyPublicKey = () => {
        navigator.clipboard.writeText(sha256(walletStore.decodeKey(operatorStore.newOperatorKeys.pubKey)));
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const moveToMyAccount = async () => {
        applicationStore.setIsLoading(true);
        await walletStore.initializeUserInfo();
        Operator.getInstance().clearOperatorsCache();
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(config.routes.MY_ACCOUNT.DASHBOARD);
        }, 7000);
    };

    return (
      <BorderScreen
        withoutNavigation
        body={[
          <Grid className={classes.Wrapper}>
            <Grid item className={classes.BackgroundImage} />
            <HeaderSubHeader
              marginBottom={13}
              title={'Welcome to the SSV Network!'}
              subtitle={'Congrats, your operator is live and could now be discoverable by all the network validators.'}
            />
            <Grid container item style={{ marginBottom: 16 }}>
              <Typography className={classes.Text}>Your network identifier is the following address:</Typography>
            </Grid>
            <Grid container item style={{ gap: 8 }}>
              <Typography className={classes.LightText}>Operator address</Typography>
              <Grid container className={classes.OperatorAddressWrapper}>
                <Grid item xs={11} style={{ overflow: 'scroll' }}>
                  0x{sha256(walletStore.decodeKey(operatorStore.newOperatorKeys.pubKey))}
                </Grid>
                <Grid item>
                  <ImageDiv image={'copy'} onClick={copyPublicKey} width={24} height={24} />
                </Grid>
              </Grid>
            </Grid>
            <Grid container item style={{ marginBottom: 24 }}>
              <Grid className={classes.Text}>
                Jump into our documentation to learn more about how to <LinkText text={'monitor'}
                  link={'monitor'} /> <br />
                and <LinkText text={'troubleshoot'} link={'troubleshoot'} /> your node.</Grid>
            </Grid>
            <Grid container item style={{ marginBottom: 24 }}>
              <Typography className={classes.Text}>To manage your account and operator enter your account
                dashboard.</Typography>
            </Grid>
            <PrimaryButton disable={false} text={'Manage Operator'} submitFunction={moveToMyAccount} />
          </Grid>,
            ]}
        />
    );
};

export default observer(SetOperatorFee);
