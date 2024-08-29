import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { ValidatorStore } from '~app/common/stores/applications/SsvWeb';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import { useStyles } from '~app/components/common/FundingSummary/FundingSummary.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getSelectedOperatorsFee } from '~app/redux/operator.slice.ts';

type Props = {
  days: number;
  networkCost?: number;
  operatorsCost?: number;
  liquidationCollateralCost: number | Decimal;
  validatorsCount?: number;
};

enum PaymentId {
  OPERATOR_FEE = 1,
  NETWORK_FEE = 2,
  LIQUIDATION_COLLATERAL = 3
}

const FundingSummary = (props: Props) => {
  const { networkFee } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const stores = useStores();
  const classes = useStyles();
  const validatorStore: ValidatorStore = stores.Validator;
  const isMultiSharesMode = validatorStore.isMultiSharesMode || (props.validatorsCount && props.validatorsCount > 1);
  const countOfValidators = props.validatorsCount || validatorStore.validatorsCount;
  const daysPeriod = props.days;
  const payments = [
    { id: PaymentId.OPERATOR_FEE, name: 'Operator fee' },
    { id: PaymentId.NETWORK_FEE, name: 'Network fee' },
    { id: PaymentId.LIQUIDATION_COLLATERAL, name: 'Liquidation collateral' }
  ];
  const FundingSummeryColumns = {
    FUNDING_SUMMARY: 'Funding Summary',
    FEE: `Fee (${daysPeriod} Days)`,
    VALIDATORS: 'Validators',
    SUBTOTAL: 'Subtotal'
  };
  const selectedOperatorsFee = useAppSelector(getSelectedOperatorsFee);

  const networkCost = props.networkCost ?? propertyCostByPeriod(networkFee, daysPeriod);
  const operatorsCost = props.operatorsCost ?? propertyCostByPeriod(selectedOperatorsFee, daysPeriod);

  const paymentsValue = (paymentId: number): number | Decimal => {
    switch (paymentId) {
      case PaymentId.OPERATOR_FEE:
        return operatorsCost;
      case PaymentId.NETWORK_FEE:
        return networkCost;
      case PaymentId.LIQUIDATION_COLLATERAL:
        return props.liquidationCollateralCost;
      default:
        return 0; // TODO throw exception. handle above.
    }
  };

  const mandatoryColumns = isMultiSharesMode
    ? Object.values(FundingSummeryColumns)
    : Object.values(FundingSummeryColumns).filter((flow: string) => flow !== FundingSummeryColumns.FEE && flow !== FundingSummeryColumns.VALIDATORS);
  const columnValues = {
    [FundingSummeryColumns.FUNDING_SUMMARY]: (value: number) => payments.find((payment) => payment.id === value)?.name,
    [FundingSummeryColumns.FEE]: (value: number) => `${formatNumberToUi(paymentsValue(value))} SSV`,
    [FundingSummeryColumns.VALIDATORS]: () => countOfValidators,
    [FundingSummeryColumns.SUBTOTAL]: (value: number) => `${formatNumberToUi(isMultiSharesMode ? Number(paymentsValue(value)) * countOfValidators : paymentsValue(value))} SSV`
  };

  const columnStyles: any = {
    [FundingSummeryColumns.FUNDING_SUMMARY]: classes.FundingSummaryColumn,
    [FundingSummeryColumns.FEE]: classes.FeeColumn,
    [FundingSummeryColumns.VALIDATORS]: classes.ValidatorsColumn,
    [FundingSummeryColumns.SUBTOTAL]: classes.SubtotalColumn
  };

  return (
    <Grid className={classes.Wrapper}>
      {mandatoryColumns.map((fundingSummeryColumnName: string) => (
        <Grid className={columnStyles[fundingSummeryColumnName]} key={fundingSummeryColumnName}>
          <Typography className={classes.Title}>{fundingSummeryColumnName}</Typography>
          {payments.map((payment: any) => (
            <Typography key={payment.id} className={classes.Value}>
              {columnValues[fundingSummeryColumnName](payment.id)}
            </Typography>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};
export default observer(FundingSummary);
