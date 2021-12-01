import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { formatDaysToUi, formatNumberToUi } from '~lib/utils/numbers';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import ErrorText from '~app/components/MyAccount/common/componenets/ErrorText/ErrorText';
import { useStyles } from './MyBalance.styles';

const ActionButton = styled.div<{ deposit?: boolean }>`
  margin: ${props => props.deposit ? '15.5px 2px 0 16px' : '15.5px 16px 0 6px'};
  padding: ${props => props.deposit ? '12px 39px 13px 40px' : '12px 28px 13px 29px'};
  background-color:  ${props => props.deposit ? '#2a323e' : 'white'};
  border: ${props => props.deposit ? '#2a323e' : 'solid 1px #5b6c84'};
`;

const ActionButtonText = styled.div<{ deposit?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.28;
  text-align: center;
  color: ${props => props.deposit ? '#fff' : '#5b6c84'};
`;

const MyBalance = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const remainingDays = formatDaysToUi(ssvStore.getRemainingDays);
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
            {formatNumberToUi(ssvStore.networkContractBalance)} SSV
          </Grid>
        );
    };

    const renderCtaActions = () => {
        if (liquidated) {
            return (
              <Grid container item xs={12} className={classes.ActionButtonWrapper}>
                <Grid item xs={12}>
                  <ActionButton deposit className={classes.ActionButtonLiquidated} onClick={() => { history.push(config.routes.MY_ACCOUNT.ENABLE_ACCOUNT); }}>
                    <ActionButtonText deposit>Reactivate Account</ActionButtonText>
                  </ActionButton>
                </Grid>
              </Grid>
            );
        }

        return (
          <Grid container item className={classes.ActionButtonWrapper}>
            {ssvStore.isValidatorState && (
            <Grid item className={classes.ActionButton} onClick={() => { history.push(config.routes.MY_ACCOUNT.DEPOSIT); }}>
              Deposit
            </Grid>
                )}
            <Grid item className={`${classes.ActionButton} ${!ssvStore.isValidatorState ? classes.ActionButtonLarge : ''}`} onClick={() => { history.push(config.routes.MY_ACCOUNT.WITHDRAW); }}>
              Withdraw
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
            {renderBalance()}
            <Grid item xs={12} className={classes.CurrentBalanceDollars}>
              ~$449.52
            </Grid>
          </Grid>
        </Grid>
        {(!liquidated && ssvStore.isValidatorState) && <Grid item className={classes.SeparationLine} xs={12} />}
        <Grid container item className={classes.SectionWrapper}>
          {(!liquidated && ssvStore.isValidatorState) && <RemainingDays wrapperClass={classes.CurrentBalanceHeader} />}
          {!liquidated && remainingDays < 30 && <Grid className={classes.ErrorMessageWrapper}><ErrorText errorType={0} /></Grid>}
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

export default observer(MyBalance);
