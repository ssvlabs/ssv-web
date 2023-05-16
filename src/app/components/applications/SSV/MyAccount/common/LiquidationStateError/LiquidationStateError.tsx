import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText/LinkText';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError.styles';

export const LiquidationStateErrorType = {
    Deposit: 0,
    Withdraw: 1,
    Liquidated: 2,
    WithdrawAll: 3,
    ChangeOperatorsLiquidation: 5,
    ChangeOperatorsLiquidationWarning: 4,
};

type Props = {
    errorType: number,
    marginTop?: string,
};

const LiquidationStateError = (props: Props) => {
    const { errorType, marginTop } = props;
    const classes = useStyles();

    const renderText = () => {
        if (errorType === LiquidationStateErrorType.WithdrawAll) {
            return <div>Withdrawing the requested amount will liquidate your cluster, which will result in inactivation (<LinkText className={classes.LinkText} text={'penalties on the beacon chain'} link={config.links.ETHER_RESPONSIBILITIES} />) of your validators, as they will no longer be operated by the network.</div>;
        } if (errorType === LiquidationStateErrorType.Liquidated) {
            return 'Your cluster has been liquidated. Please reactivate your cluster in order to resume your validators operation.';
        } if (errorType === LiquidationStateErrorType.Deposit) {
            return 'Your balance is running low and puts your cluster at risk. \n' +
                'To avoid liquidation please deposit more funds to your cluster.';
        } if (errorType === LiquidationStateErrorType.Withdraw) {
            return 'This withdrawal amount will putting your cluster at risk of liquidation.\n' +
                'To avoid liquidation please withdraw less funds from your cluster.\n';
        }
        const firstText = errorType === LiquidationStateErrorType.ChangeOperatorsLiquidationWarning ? 'This withdrawal amount will place your cluster at risk of liquidation.' : 'This fee change will liquidate your cluster, please deposit more SSV or';
        const secondText = errorType === LiquidationStateErrorType.ChangeOperatorsLiquidationWarning ? 'To avoid liquidation please withdraw less funds from your cluster.' : 'change to a different set of operators.';

        if (errorType === LiquidationStateErrorType.ChangeOperatorsLiquidationWarning || errorType === LiquidationStateErrorType.ChangeOperatorsLiquidation) {
            return (
              <Grid container item className={classes.OperatorChangeTextWrapper}>
                <Grid item>
                  <Typography className={classes.OperatorChangeText}>{firstText}</Typography>
                  <Typography className={classes.OperatorChangeText}>{secondText}</Typography>
                </Grid>
                <Grid item>
                  <LinkText routePush withoutUnderline text={'Deposit'} link={config.routes.SSV.MY_ACCOUNT.CLUSTER.DEPOSIT} />
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
          <Grid item>
            <LinkText className={classes.LinkText} text={'Read more on liquidations'} link={config.links.MORE_ON_LIQUIDATION_LINK} />
          </Grid>
          )}
      </Grid>
    );
};

export default observer(LiquidationStateError);
