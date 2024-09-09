import Grid from '@mui/material/Grid';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import { translations } from '~app/common/config';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Balance/Balance.styles';
import ErrorText from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';
import { fromWei } from '~root/services/conversions.service';
import { ICluster } from '~app/model/cluster.model';
import { PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import styled from 'styled-components';

const OperationRunwayWrapper = styled.div`
  width: 100%;
`;

const Balance = ({
  cluster,
  moveToReactivateCluster,
  hasPrivateOperators,
  moveToDeposit,
  moveToWithdraw
}: {
  cluster: ICluster;
  moveToReactivateCluster: Function;
  hasPrivateOperators: boolean;
  moveToDeposit: Function;
  moveToWithdraw: Function;
}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.MyBalanceWrapper}>
      <Grid container item className={classes.SectionWrapper}>
        <Grid container item className={classes.Header} xs={12}>
          <span>Balance</span>
          {cluster.isLiquidated && <Grid className={classes.Liquidated}>Liquidated</Grid>}
          {cluster.runWay < 30 && !cluster.isLiquidated && !!Number(cluster.balance) && !cluster.validatorCount && <Grid className={classes.LowRunWay}>Low Runway</Grid>}
        </Grid>
        <Grid container item>
          {cluster.balance || cluster.isLiquidated ? (
            <Grid item xs={12} className={cluster.runWay < 30 ? classes.CurrentBalanceLiquidated : classes.CurrentBalance}>
              {formatNumberToUi(fromWei(cluster.balance))} SSV
            </Grid>
          ) : (
            <NaDisplay size={28} weight={800} text={translations.NA_DISPLAY.TOOLTIP_TEXT} />
          )}
          <Grid item xs={12} className={classes.CurrentBalanceDollars}></Grid>
        </Grid>
      </Grid>
      {(Number(cluster.balance) || cluster.isLiquidated) && (
        <OperationRunwayWrapper>
          {(cluster.validatorCount || cluster.isLiquidated) && (
            <div>
              <Grid item className={classes.SeparationLine} xs={12} />
              <Grid container item className={classes.SecondSectionWrapper}>
                <NewRemainingDays cluster={cluster} />
                {cluster.isLiquidated && (
                  <Grid className={classes.ErrorMessageWrapper}>
                    <ErrorText marginTop={'16px'} errorType={2} />
                  </Grid>
                )}
              </Grid>
            </div>
          )}
          <Grid item className={classes.SeparationLine} xs={12} />
          {cluster.isLiquidated ? (
            <Grid container item xs={12} className={classes.ActionButtonWrapper}>
              <PrimaryButton text={'Reactivate Cluster'} isDisabled={hasPrivateOperators} onClick={moveToReactivateCluster} size={ButtonSize.XL} />
            </Grid>
          ) : (
            <Grid container item className={classes.ActionButtonWrapper}>
              <Grid item xs>
                <PrimaryButton text={'Deposit'} onClick={moveToDeposit} size={ButtonSize.XL} />
              </Grid>
              <Grid item xs>
                <SecondaryButton text={'Withdraw'} onClick={moveToWithdraw} size={ButtonSize.XL} />
              </Grid>
            </Grid>
          )}
        </OperationRunwayWrapper>
      )}
    </Grid>
  );
};

export default Balance;
