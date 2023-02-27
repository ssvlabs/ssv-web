import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/ValidatorSuccessScreen/ValidatorSuccessScreen.styles';

const ValidatorSuccessScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const buttonText = 'Manage Validator';
  const clusterStore: ClusterStore = stores.Cluster;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const operators = Object.values(operatorStore.selectedOperators);
  const clusterHash = clusterStore.getClusterHash(operators.map((operator) => operator.id).sort());

  const redirectTo = async () => {
    applicationStore.setIsLoading(true);
    setTimeout(() => {
      applicationStore.setIsLoading(false);
      navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    }, 5000);
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'validator',
    });
  };

  return (
    <>
      <BorderScreen
        blackHeader
        withoutNavigation
        header={translations.SUCCESS.TITLE}
        sectionClass={classes.Section}
        body={[
          <Grid item container className={classes.Wrapper}>
            <Grid item className={classes.Text}>Your new validator is managed by the following cluster:</Grid>
            <Grid container item className={classes.ClusterID}>
              <Typography>Validator Cluster {longStringShorten(clusterHash, 4)}</Typography>
              <Tooltip text={'adsasd'} />
            </Grid>
            <Grid container item style={{ gap: 24, alignItems: 'flex-start' }}>
              {Object.values(operatorStore.selectedOperators).map((operator: any) => {
                return <Grid container item className={classes.Operator}>
                  <Grid item className={classes.OperatorImage} xs={12}/>
                  <Grid item className={classes.OperatorName} xs>Unknown</Grid>
                  <Grid item className={classes.OperatorId}>ID: {operator.id}</Grid>
                </Grid>;
              })}
            </Grid>
            <Grid item className={classes.Text}>Your cluster operators have been notified and will start your validator operation instantly.</Grid>
            <PrimaryButton text={buttonText} submitFunction={redirectTo} />
          </Grid>,
        ]}
      />
      {/* <BorderScreen */}
      {/*  borderRadius={'0 0 16px 16px'} */}
      {/*  wrapperClass={classes.Incentivized} */}
      {/*  withoutNavigation */}
      {/*  body={[ */}
      {/*    <Grid container item> */}
      {/*      <Typography className={classes.IncentivizedTitle}>The &apos;Primus&apos; Incentivized Testnet is Live</Typography> */}
      {/*      <Typography className={classes.IncentivizedSubTitle}> */}
      {/*        All eligible validators will receive SSV rewards for participation */}
      {/*        <LinkText link={'https://snapshot.org/#/mainnet.ssvnetwork.eth/proposal/QmSbouw5SCUmKMQwW7s1bEwhfXJ9LQJHetsruU8MrUTwBE'} text={'(conditions)'} /> */}
      {/*      </Typography> */}
      {/*      <Typography className={classes.IncentivizedSmallHeader}>Stakers Earn More</Typography> */}
      {/*      <Typography className={classes.IncentivizedSubTitle}> */}
      {/*        Validators who also <b>stake SSV</b> tokens are generating <b>over x5 more rewards</b> comparing to non staking validators. */}
      {/*      </Typography> */}
      {/*      <Typography className={classes.IncentivizedSmallHeader}>Get SSV tokens</Typography> */}
      {/*      <Grid container item className={classes.IncentivizedLogos} justifyContent={'space-between'}> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://coinmarketcap.com/currencies/ssv-network/', 'coinmarketcap'); }} /> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://www.binance.com/en/trade/SSV_BTC', 'binance'); }} /> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://www.gate.io/trade/SSV_USDT', 'gate'); }} /> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://app.uniswap.org/', 'uniswap'); }} /> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://www.mexc.com/exchange/SSV_USDT', 'mexc'); }} /> */}
      {/*        <Grid item onClick={() => { linkToExchange('https://www.xt.com/trade/ssv_usdt/', 'xt'); }} /> */}
      {/*      </Grid> */}
      {/*      <Typography className={classes.IncentivizedSubTitle}> */}
      {/*        To receive staking rewards you must hold SSV tokens with the same wallet address that you used to register your validator to the network. */}
      {/*      </Typography> */}
      {/*    </Grid>, */}

      {/*  ]} */}
      {/* /> */}
    </>
  );
};

export default observer(ValidatorSuccessScreen);
