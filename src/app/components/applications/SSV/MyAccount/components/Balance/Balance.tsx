import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStyles } from './Balance.styles';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import RemainingDays from '~app/components/applications/SSV/NewMyAccount/common/NewRemainingDays';
import ProcessStore, { SingleClusterProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import ErrorText
  from '~app/components/applications/SSV/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError';

const Balance = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const process: SingleClusterProcess = processStore.getProcess;
  const cluster = process.item;
  const liquidated = cluster.isLiquidated;

  function moveToEnableAccount() {
    return navigate(config.routes.SSV.MY_ACCOUNT.ENABLE_ACCOUNT);
  }

  function moveToDeposit() {
    return navigate(config.routes.SSV.MY_ACCOUNT.DEPOSIT);
  }

  function moveToWithdraw() {
    return navigate(config.routes.SSV.VALIDATOR.IMPORT);
    // return navigate(config.routes.SSV.MY_ACCOUNT.WITHDRAW);
  }

  const renderCtaActions = () => {
    if (liquidated) {
      return (
        <Grid container item xs={12} className={classes.ActionButtonWrapper}>
          <PrimaryButton text={'Reactivate Account'} submitFunction={moveToEnableAccount} />
        </Grid>
      );
    }

    return (
        <Grid container item className={classes.ActionButtonWrapper}>
          <Grid item xs>
            <PrimaryButton text={'Deposit'} submitFunction={moveToDeposit}/>
          </Grid>
          <Grid item xs>
            <SecondaryButton text={'Withdraw'} submitFunction={moveToWithdraw}/>
          </Grid>
        </Grid>
    );
  };

  return (
    <Grid container className={classes.MyBalanceWrapper}>
      <Grid container item className={classes.SectionWrapper}>
        <Grid item className={classes.Header} xs={12}>
          <span>Balance</span>
        </Grid>
        <Grid container item>
          <Grid item xs={12} className={liquidated ? classes.CurrentBalanceLiquidated : classes.CurrentBalance}>
            {formatNumberToUi(ssvStore.toDecimalNumber(walletStore.fromWei(cluster.balance)))} SSV
          </Grid>
          <Grid item xs={12} className={classes.CurrentBalanceDollars}>
            {/* ~$449.52 */}
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item className={classes.SectionWrapper}>
          {!liquidated && <RemainingDays cluster={cluster} />}
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
