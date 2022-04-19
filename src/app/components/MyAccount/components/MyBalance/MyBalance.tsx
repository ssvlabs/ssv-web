import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import ErrorText from '~app/components/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError';
import { useStyles } from './MyBalance.styles';

const MyBalance = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    // const remainingDays = formatDaysToUi(ssvStore.getRemainingDays());
    const liquidated = ssvStore.userLiquidated && ssvStore.isValidatorState;

    const renderBalance = () => {
        if (liquidated) {
            return (
              <Grid item xs={12} className={classes.CurrentBalanceLiquidated}>
                0.0 SSV
              </Grid>
            );
        }

        return (
          <Grid item xs={12} className={classes.CurrentBalance}>
            {formatNumberToUi(ssvStore.contractDepositSsvBalance)} SSV
          </Grid>

        );
    };

    function moveToEnableAccount() {
        return history.push(config.routes.MY_ACCOUNT.ENABLE_ACCOUNT);
    }

    function moveToDeposit() {
        return history.push(config.routes.MY_ACCOUNT.DEPOSIT);
    }

    function moveToWithdraw() {
        return history.push(config.routes.MY_ACCOUNT.WITHDRAW);
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
            {ssvStore.isValidatorState && (
            <Grid item className={classes.ActionButton} onClick={moveToDeposit}>
              Deposit
            </Grid>
            )}
            <Grid item
              xs
              className={`${classes.ActionButton} ${!ssvStore.isValidatorState ? classes.ActionButtonLarge : ''}`}
              onClick={moveToWithdraw}
            >
              Withdraw
            </Grid>
          </Grid>
        );
    };

    const renderConditionalLine = () => {
        if (!liquidated && ssvStore.isValidatorState) {
            return <Grid item className={classes.SeparationLine} xs={12} />;
        }
    };

    return (
      <Grid container className={classes.MyBalanceWrapper}>
        <Grid container item className={classes.SectionWrapper}>
          <Grid item className={classes.Header} xs={12}>
            <span>Balance</span>
          </Grid>
          <Grid container item>
            {renderBalance()}
            <Grid item xs={12} className={classes.CurrentBalanceDollars}>
              ~$449.52
            </Grid>
          </Grid>
        </Grid>
        {renderConditionalLine()}
        {ssvStore.isValidatorState && (
          <Grid container item className={classes.SectionWrapper}>
            {!ssvStore.userLiquidated && <RemainingDays />}
            {liquidated && (
            <Grid className={classes.ErrorMessageWrapper}>
              <ErrorText
                marginTop={'16px'}
                errorType={2}
              />
            </Grid>
            )}
          </Grid>
          )}
        <Grid item className={classes.SeparationLine} xs={12} />
        {renderCtaActions()}
      </Grid>
    );
};

export default observer(MyBalance);
