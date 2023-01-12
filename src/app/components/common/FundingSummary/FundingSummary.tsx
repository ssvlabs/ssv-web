import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/common/FundingSummary/FundingSummary.styles';

type Props = {
  days?: number,
};

const FundingSummary = (props: Props) => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const daysPeriod = props.days ?? validatorStore.fundingPeriod;
  const payments = [
    { id: 1, name: 'Operator fee' },
    { id: 2, name: 'Network fee' },
    { id: 3, name: 'Liquidation collateral' },
  ];

  const propertyCostByPeriod = (property: number, days: number): number => {
    return property * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY * (days || 1);
  };

  const networkCost = propertyCostByPeriod(ssvStore.networkFee, daysPeriod);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, daysPeriod);
  const liquidationCollateralCost = propertyCostByPeriod(ssvStore.liquidationCollateral, daysPeriod);

  const paymentsValue = (paymentId: number): string => {
    switch (paymentId) {
      case 1:
        return String(operatorsCost);
      case 2:
        return String(networkCost);
      case 3:
        return String(liquidationCollateralCost);
      default:
        return '';
    }
  };

  return (
      <Grid container>
        <Typography className={classes.BigGreyHeader}>Funding Summary</Typography>
        {payments.map((payment: { id: number, name: string }, index: number) => {
          const paymentValue = paymentsValue(payment.id);
          const isLast = payment.id === 3;
          return <Grid key={index} container item>
            <Grid container item xs style={{ gap: 8, marginBottom: index !== 2 ? 8 : 0 }}>
              <Grid item>
                <Typography className={classes.Text} style={{ marginBottom: 0 }}>{payment.name}</Typography>
              </Grid>
              <Grid item>
                {isLast ? <Tooltip
                        text={<Grid>Collateral in the form of SSV tokens to be paid to liquidators in case of account
                          insolvency. <LinkText text={'Read more on liquidations'}
                                                link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}/></Grid>}/> :
                    <Typography
                        className={`${classes.GreyHeader} ${classes.BiggerFont}`}>x {daysPeriod} Days</Typography>}
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography className={classes.Text}
                          style={{ textAlign: 'right', marginBottom: 0 }}>{paymentValue} SSV</Typography>
            </Grid>
          </Grid>;
        })}
      </Grid>
  );
};

export default observer(FundingSummary);
