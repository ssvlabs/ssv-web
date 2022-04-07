import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import { getEtherScanUrl } from '~lib/utils/beaconcha';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import SecondaryButton from '~app/common/components/Buttons/SecondaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/Distribution/components/Success/Success.styles';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';

const Success = () => {
    const stores = useStores();
    const classes = useStyles();
    const etherScan = getEtherScanUrl();
    const distributionStore: DistributionStore = stores.Distribution;

    const openEtherScan = () => {
        window.open(`${etherScan}/tx/${distributionStore.txHash}`);
    };

    const openMarketingSite = () => {
        window.open('https://ssv.network/');
    };

    return (
      <BorderScreen
        body={[
          <Grid container className={classes.Wrapper}>
            <HeaderSubHeader
              title={'Rewards succefully claimed!'}
              subtitle={'Your tokens has been sent to your wallet. Thank you for participating in the ssv.network testnet'}
            />
            <Grid item container className={classes.AddSsvToWallet} onClick={distributionStore.registerSSVTokenInMetamask}>
              <Grid item className={classes.MetaMask} />
              <Typography component={'span'}>Add SSV to Metamask</Typography>
            </Grid>
            <Grid item xs className={classes.EtherScan} onClick={openEtherScan}>View Transaction on Etherscan</Grid>
            <SecondaryButton submitFunction={openMarketingSite} text={'Learn more about the ssv network'} />
          </Grid>,
        ]}
      />
    );
};

export default observer(Success);
