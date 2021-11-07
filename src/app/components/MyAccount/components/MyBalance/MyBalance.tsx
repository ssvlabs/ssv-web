import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import { useStyles } from './MyBalance.styles';

// type HeaderProps = {
//     title: string,
//     subtitle: string,
//     centralize?: boolean
// };

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
    const classes = useStyles();
    const history = useHistory();

    return (
      <Grid container className={classes.MyBalanceWrapper}>
        <Grid item className={classes.Header} xs={12}>
          <span>Balance</span>
        </Grid>
        <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item>
          <Grid item xs={12} className={classes.CurrentBalanceHeader}>
            Current Balance
          </Grid>
          <Grid item xs={12} className={classes.CurrentBalance}>
            274.77 SSV
          </Grid>
          <Grid item xs={12} className={classes.CurrentBalanceDollars}>
            ~$449.52
          </Grid>
        </Grid>
        <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item>
          <Grid item xs={12} className={classes.CurrentBalanceHeader}>
            Est. Remaining Days
          </Grid>
          <Grid item xs={12} className={classes.RemainingDaysNumber}>
            <span>295</span>
            <span className={classes.RemainingDays}>days</span>
          </Grid>
        </Grid>
        <Grid item className={classes.SeparationLine} xs={12} />
        <Grid container item className={classes.ActionButtonWrapper}>
          <Grid item xs={6}>
            <ActionButton deposit className={classes.ActionButton} onClick={() => { history.push(config.routes.MY_ACCOUNT.DEPOSIT); }}><ActionButtonText deposit>Deposit</ActionButtonText></ActionButton>
          </Grid>
          <Grid item xs={6}>
            <ActionButton className={classes.ActionButton} onClick={() => { history.push(config.routes.MY_ACCOUNT.WITHDRAW); }}><ActionButtonText>Withdraw</ActionButtonText></ActionButton>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default MyBalance;
