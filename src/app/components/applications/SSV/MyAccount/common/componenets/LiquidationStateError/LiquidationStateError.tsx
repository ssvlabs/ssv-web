import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText/LinkText';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError.styles';

const ErrorType = {
    Deposit: 0,
    Withdraw: 1,
    Liquidated: 2,
    WithdrawAll: 3,
    ChangeOperatorsLiquidation: 5,
    ChangeOperatorsLiquidationWarning: 4,
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
            return <div>Withdrawing the requested amount will liquidate your account, which will result in inactivation (<LinkText text={'penalties on the beacon chain'} link={'https://launchpad.ethereum.org/en/faq#responsibilities'} />) of your validators, as they will no longer be operated by the network.</div>;
        } if (errorType === ErrorType.Liquidated) {
            return 'Your account has been liquidated. Please reactivate your account in order to resume your validators operation.';
        } if (errorType === ErrorType.Deposit) {
            return 'Your balance is running low and puts your account at risk. \n' +
                'To avoid liquidation please deposit more funds to your cluster.';
        } if (errorType === ErrorType.Withdraw) {
            return 'This withdrawal amount will putting your account at risk of liquidation.\n' +
                'To avoid liquidation please withdraw less funds from your cluster.\n';
        }
        const firstText = errorType === ErrorType.ChangeOperatorsLiquidationWarning ? 'This withdrawal amount will place your account at risk of liquidation.' : 'This fee change will liquidate your account, please deposit more SSV or';
        const secondText = errorType === ErrorType.ChangeOperatorsLiquidationWarning ? 'To avoid liquidation please withdraw less funds from your account.' : 'change to a different set of operators.';

        if (errorType === ErrorType.ChangeOperatorsLiquidationWarning || errorType === ErrorType.ChangeOperatorsLiquidation) {
            return (
              <Grid container item className={classes.OperatorChangeTextWrapper}>
                <Grid item>
                  <Typography className={classes.OperatorChangeText}>{firstText}</Typography>
                  <Typography className={classes.OperatorChangeText}>{secondText}</Typography>
                </Grid>
                <Grid item>
                  <LinkText routePush withoutUnderline text={'Deposit'} link={config.routes.SSV.MY_ACCOUNT.DEPOSIT} />
                </Grid>
              </Grid>
            );
        }

        return '';
    };

    return (
      <Grid item container className={classes.ErrorTextWrapper} style={{ marginTop: `${marginTop}` }}>
        <Grid item className={classes.ErrorText}>
          {renderText()}
        </Grid>
        {errorType !== 4 && errorType !== 5 && (
          <Grid item className={classes.LinkText}>
            <LinkText text={'Read more on liquidations'} link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'} />
          </Grid>
          )}
      </Grid>
    );
};

export default observer(LiquidationStateError);
