import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import ProcessStore, { RegisterValidator } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/common/FundingSummary/FundingSummary.styles';
import Decimal from 'decimal.js';

type Props = {
  days?: number,
};

const FundingSummary = (props: Props) => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const process: RegisterValidator = processStore.process as RegisterValidator;
  const daysPeriod = props.days ?? process.fundingPeriod;
  const payments = [
    { id: 1, name: 'Operator fee' },
    { id: 2, name: 'Network fee' },
    { id: 3, name: 'Liquidation collateral' },
  ];

  const networkCost = propertyCostByPeriod(ssvStore.networkFee, daysPeriod);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, daysPeriod);
  const liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);

  const paymentsValue = (paymentId: number): string => {
    switch (paymentId) {
      case 1:
        return formatNumberToUi(operatorsCost);
      case 2:
        return formatNumberToUi(networkCost);
      case 3:
        return formatNumberToUi(liquidationCollateralCost);
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
                        text={<Grid>Collateral in the form of SSV tokens,
                          which will be lost at the event of your cluster insolvency
                          (inability to cover your validator&apos;s operational costs). <LinkText text={'Read more on liquidations'} link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}/></Grid>}/> :
                    <Typography
                        className={`${classes.GreyHeader} ${classes.BiggerFont}`}>x {formatNumberToUi(daysPeriod, true)} Days</Typography>}
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
