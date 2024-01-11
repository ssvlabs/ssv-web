import React from 'react';
import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { ValidatorStore } from '~app/common/stores/applications/SsvWeb';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/common/FundingSummary/FundingSummary.styles';
import ProcessStore, { RegisterValidator } from '~app/common/stores/applications/SsvWeb/Process.store';

type Props = {
  days?: number,
  networkCost?: number,
  operatorsCost?: number,
  liquidationCollateralCost?: number | Decimal,
};

const FundingSummeryColumns = {
  FUNDING_SUMMARY: 'Funding Summary',
  FEE: 'Fee (365 Days)',
  VALIDATORS: 'Validators',
  SUBTOTAL: 'Subtotal',
};

enum PaymentId {
  OPERATOR_FEE = 1,
  NETWORK_FEE = 2,
  LIQUIDATION_COLLATERAL = 3,
}

const FundingSummary = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const process: RegisterValidator = processStore.process as RegisterValidator;
    const daysPeriod = props.days ?? process.fundingPeriod;
    const payments = [
      { id: PaymentId.OPERATOR_FEE, name: 'Operator fee' },
      { id: PaymentId.NETWORK_FEE, name: 'Network fee' },
      { id: PaymentId.LIQUIDATION_COLLATERAL, name: 'Liquidation collateral' },
    ];

    const networkCost = props.networkCost ?? propertyCostByPeriod(ssvStore.networkFee, daysPeriod);
    const operatorsCost = props.operatorsCost ?? propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, daysPeriod);
    const liquidationCollateralCost = props.liquidationCollateralCost ?? new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);

    const paymentsValue = (paymentId: number | string): string => {
      switch (Number(paymentId)) {
        case PaymentId.OPERATOR_FEE:
          return formatNumberToUi(operatorsCost);
        case PaymentId.NETWORK_FEE:
          return formatNumberToUi(networkCost);
        case PaymentId.LIQUIDATION_COLLATERAL:
          return formatNumberToUi(liquidationCollateralCost);
        default:
          return '';
      }
    };

    const mandatoryColumns = validatorStore.isMultiSharesMode ? Object.values(FundingSummeryColumns) : Object.values(FundingSummeryColumns).filter((flow: string) => flow !== FundingSummeryColumns.FEE && flow !== FundingSummeryColumns.VALIDATORS);

    const columnValues = {
      [FundingSummeryColumns.FUNDING_SUMMARY]: (value: string | number) => payments.find(payment => payment.id === value)?.name,
      [FundingSummeryColumns.FEE]: (value: string | number) => `${paymentsValue(Number(value).toFixed(2))} SSV`,
      [FundingSummeryColumns.VALIDATORS]: () => validatorStore.validatorsCount,
      [FundingSummeryColumns.SUBTOTAL]: (value: string | number) => `${validatorStore.isMultiSharesMode ? formatNumberToUi(Number(Number(paymentsValue(value)) * validatorStore.validatorsCount).toFixed(2)) : paymentsValue(value)} SSV`,
    };

    const columnStyles: any = {
      [FundingSummeryColumns.FUNDING_SUMMARY]: classes.FundingSummaryColumn,
      [FundingSummeryColumns.FEE]: classes.FeeColumn,
      [FundingSummeryColumns.VALIDATORS]: classes.ValidatorsColumn,
      [FundingSummeryColumns.SUBTOTAL]: classes.SubtotalColumn,
    };

    return (
      <Grid className={classes.Wrapper}>
        {mandatoryColumns.map((fundingSummeryColumnName: string) =>
          <Grid className={columnStyles[fundingSummeryColumnName]}>
            <Typography className={classes.Title}>{fundingSummeryColumnName}</Typography>
            {payments.map((payment: any) => <Typography
              className={classes.Value}>{columnValues[fundingSummeryColumnName](payment.id)}</Typography>)}
          </Grid>,
        )}
      </Grid>
    );
  }
;

export default observer(FundingSummary);
