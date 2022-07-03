import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import { useStyles } from './OperatorSuccessPage.styles';
// import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/common/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

const SetOperatorFee = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    // const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const [operatorId, setOperatorId] = useState('');
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    
    useEffect(() => {
        operatorStore.getOperatorByPublicKey(operatorStore.newOperatorKeys.pubKey).then(() => {
            setOperatorId('8');
        });
    }, []);

    const copyOperatorId = () => {
        navigator.clipboard.writeText(operatorId);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const moveToMyAccount = async () => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().clearOperatorsCache();
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
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
              <Typography className={classes.Text}>Your network identifier is the following:</Typography>
            </Grid>
            <Grid onClick={copyOperatorId}>
              {operatorId}
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
