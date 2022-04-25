import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from '~app/components/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError.styles';
import LinkText from '~app/common/components/LinkText/LinkText';

const ErrorType = {
    Deposit: 0,
    Withdraw: 1,
    Liquidated: 2,
    WithdrawAll: 3,
} as const;

type Props = {
    errorType: number,
    marginTop?: string,
};

const LiquidationStateError = (props: Props) => {
    const { errorType, marginTop } = props;
    const classes = useStyles();

    const renderText = () => {
        if (errorType === ErrorType.WithdrawAll) {
            return <div>Withdrawing the requested amount will liquidate your account, which will result in inactivation (<a href={'/a'}>penalties on the beacon chain</a>) of your validators, as they will no longer be operated by the network.</div>;
        } if (errorType === ErrorType.Liquidated) {
            return 'Your account has been liquidated. Please reactivate your account in order to resume your validators operation.';
        } if (errorType === ErrorType.Deposit) {
            return 'Your balance is running low and puts your account at risk. \n' +
                'To avoid liquidation please deposit more funds to your account.';
        } if (errorType === ErrorType.Withdraw) {
            return 'This withdrawal amount will putting your account at risk of liquidation.\n' +
                'To avoid liquidation please withdraw less funds from your account.\n';
        }
            return '';
    };

    return (
      <Grid item container className={classes.ErrorTextWrapper} style={{ marginTop: `${marginTop}` }}>
        <Grid item className={classes.ErrorText}>
          {renderText()}
        </Grid>
        <Grid item className={classes.LinkText}>
          <LinkText text={'Read more on liquidations'} link={''} />
        </Grid>
      </Grid>
    );
};

export default observer(LiquidationStateError);
