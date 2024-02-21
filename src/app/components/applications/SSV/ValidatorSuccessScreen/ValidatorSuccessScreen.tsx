import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText/LinkText';
import { longStringShorten, truncateText } from '~lib/utils/strings';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import OperatorCard from '~app/components/common/OperatorCard/OperatorCard';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/ValidatorSuccessScreen/ValidatorSuccessScreen.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import { SsvStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getClusterHash } from '~root/services/cluster.service';

const ValidatorSuccessScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const buttonText = 'Manage Validator';
  const operatorStore: OperatorStore = stores.Operator;
  const walletStore: WalletStore = stores.Wallet;
  const operators = Object.values(operatorStore.selectedOperators);
  const clusterHash = getClusterHash(operators, walletStore.accountAddress);
  const timeoutRef = useRef<any>(null);
  const [hoveredGrid, setHoveredGrid] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const redirectTo = async () => {
    dispatch(setIsLoading(true));
    setTimeout(() => {
      dispatch(setIsLoading(false));
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
    }, 5000);

    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'validator',
    });
  };

  const handleGridHover = (index: string) => {
    timeoutRef.current = setTimeout(() => {
      setHoveredGrid(index);
    }, 300);
  };

  const handleGridLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setHoveredGrid(null);
    }
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
              <Typography>Validator Cluster {longStringShorten(clusterHash, 4, undefined, { '': /^0x/ })}</Typography>
              {/* need to add link to "read more on clusters" */}
              <Tooltip text={<Grid>Clusters represent a unique set of operators who operate your validators. <LinkText text={'Read more on clusters'} link={config.links.MORE_ON_CLUSTERS}/></Grid>} />
            </Grid>
            <Grid container item style={{ gap: 24, alignItems: 'flex-start' }}>
              {Object.values(operatorStore.selectedOperators).map((operator: any, index: number ) => {
                return <Grid container item className={classes.Operator} key={index}>
                  <Grid item
                        container
                        onMouseLeave={handleGridLeave}
                        className={classes.CircleImageOperatorWrapper}
                        onMouseEnter={() => handleGridHover(operator.id)}
                  >
                    {(hoveredGrid === operator.id) && (
                      <OperatorCard classExtend={index === 0 && classes.OperatorCardMargin} operator={operator} />
                  )}
                  <Grid item className={classes.OperatorImage}
                        xs={12}/>
                  </Grid>
                  <Grid container className={classes.OperatorData}>
                      <Grid item className={classes.OperatorName} xs>{truncateText(operator.name, 12)}</Grid>
                      <Grid item className={classes.OperatorId}>ID: {operator.id}</Grid>
                  </Grid>
                </Grid>;
              })}
            </Grid>
            <Grid item className={classes.Text}>Your cluster operators have been notified and will start your validator operation instantly.</Grid>
            <PrimaryButton children={buttonText} submitFunction={redirectTo} />
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
