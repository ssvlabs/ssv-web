import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import config, { translations } from '~app/common/config';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Balance/Balance.styles';
import ErrorText from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';

const Balance = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;
  const liquidated = cluster.isLiquidated;

  function moveToReactivateCluster() {
    return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.REACTIVATE);
  }

  function moveToDeposit() {
    return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.DEPOSIT);
  }

  function moveToWithdraw() {
    return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.WITHDRAW);
  }

  const clusterWarnings = () => {
    if (cluster.isLiquidated) return <Grid className={classes.Liquidated}>Liquidated</Grid>;
    if (cluster.runWay < 30) return <Grid className={classes.LowRunWay}>Low Runway</Grid>;
    return;
  };

  const renderCtaActions = () => {
    if (liquidated) {
      return (
        <Grid container item xs={12} className={classes.ActionButtonWrapper}>
          <PrimaryButton text={'Reactivate Cluster'} submitFunction={moveToReactivateCluster} />
        </Grid>
      );
    }

    return (
        <Grid container item className={classes.ActionButtonWrapper}>
          <Grid item xs>
            <PrimaryButton text={'Deposit'} submitFunction={moveToDeposit} />
          </Grid>
          <Grid item xs>
            <SecondaryButton text={'Withdraw'} submitFunction={moveToWithdraw} />
          </Grid>
        </Grid>
    );
  };

  return (
    <Grid container className={classes.MyBalanceWrapper}>
      <Grid container item className={classes.SectionWrapper}>
        <Grid container item className={classes.Header} xs={12}>
          <span>Balance</span>
          {clusterWarnings()}
        </Grid>
        <Grid container item>
          {cluster.balance || cluster.isLiquidated ?
              (<Grid item xs={12}
                 className={cluster.runWay < 30 ? classes.CurrentBalanceLiquidated : classes.CurrentBalance}>
            {formatNumberToUi(walletStore.fromWei(cluster.balance))} SSV
          </Grid>) : (<NaDisplay size={28} weight={800} text={translations.NA_DISPLAY.TOOLTIP_TEXT} />)}
          <Grid item xs={12} className={classes.CurrentBalanceDollars}>
            {/* ~$449.52 */}
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item className={classes.SecondSectionWrapper}>
          <NewRemainingDays cluster={cluster} />
          {liquidated && (
            <Grid className={classes.ErrorMessageWrapper}>
              <ErrorText
                marginTop={'16px'}
                errorType={2}
              />
            </Grid>
          )}
        </Grid>
      <Grid item className={classes.SeparationLine} xs={12} />
      {renderCtaActions()}
    </Grid>
  );
};

export default observer(Balance);
