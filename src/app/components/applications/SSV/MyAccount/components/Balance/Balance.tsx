
import Grid from '@mui/material/Grid';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import { translations } from '~app/common/config';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Balance/Balance.styles';
import ErrorText from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';
import { fromWei } from '~root/services/conversions.service';
import { ICluster } from '~app/model/cluster.model';

const Balance = ({ cluster, moveToReactivateCluster, moveToDeposit, moveToWithdraw }: { cluster: ICluster; moveToReactivateCluster: Function; moveToDeposit: Function; moveToWithdraw: Function }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.MyBalanceWrapper}>
      <Grid container item className={classes.SectionWrapper}>
        <Grid container item className={classes.Header} xs={12}>
          <span>Balance</span>
          {cluster.isLiquidated && <Grid className={classes.Liquidated}>Liquidated</Grid>}
          {cluster.runWay < 30 && <Grid className={classes.LowRunWay}>Low Runway</Grid>}
        </Grid>
        <Grid container item>
          {cluster.balance || cluster.isLiquidated ?
              (<Grid item xs={12}
                 className={cluster.runWay < 30 ? classes.CurrentBalanceLiquidated : classes.CurrentBalance}>
            {formatNumberToUi(fromWei(cluster.balance))} SSV
          </Grid>) : (<NaDisplay size={28} weight={800} text={translations.NA_DISPLAY.TOOLTIP_TEXT} />)}
          <Grid item xs={12} className={classes.CurrentBalanceDollars}>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item className={classes.SecondSectionWrapper}>
          <NewRemainingDays cluster={cluster} />
          {cluster.isLiquidated && (
            <Grid className={classes.ErrorMessageWrapper}>
              <ErrorText
                marginTop={'16px'}
                errorType={2}
              />
            </Grid>
          )}
        </Grid>
      <Grid item className={classes.SeparationLine} xs={12} />
      {cluster.isLiquidated ?
        (
          <Grid container item xs={12} className={classes.ActionButtonWrapper}>
            <PrimaryButton children={'Reactivate Cluster'} submitFunction={moveToReactivateCluster} />
          </Grid>
        ) : (
          <Grid container item className={classes.ActionButtonWrapper}>
            <Grid item xs>
              <PrimaryButton children={'Deposit'} submitFunction={moveToDeposit} />
            </Grid>
            <Grid item xs>
              <SecondaryButton children={'Withdraw'} submitFunction={moveToWithdraw} />
            </Grid>
          </Grid>
        )}
    </Grid>
  );
};

export default Balance;
