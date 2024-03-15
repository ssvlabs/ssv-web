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
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { RegisterValidator } from '~app/model/processes.model';

type Props = {
  days?: number,
  networkCost?: number,
  operatorsCost?: number,
  liquidationCollateralCost: number | Decimal,
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

    const mandatoryColumns = validatorStore.isMultiSharesMode ? Object.values(FundingSummeryColumns) : Object.values(FundingSummeryColumns).filter((flow: string) => flow !== FundingSummeryColumns.FEE && flow !== FundingSummeryColumns.VALIDATORS);

    const columnValues = {
      [FundingSummeryColumns.FUNDING_SUMMARY]: (value: number) => payments.find(payment => payment.id === value)?.name,
      [FundingSummeryColumns.FEE]: (value: number) => `${formatNumberToUi(paymentsValue(value))} SSV`,
      [FundingSummeryColumns.VALIDATORS]: () => validatorStore.validatorsCount,
      [FundingSummeryColumns.SUBTOTAL]: (value: number) => `${formatNumberToUi(validatorStore.isMultiSharesMode ? ((Number(paymentsValue(value)) * validatorStore.validatorsCount).toFixed(2)) : paymentsValue(value))} SSV`,
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
          <Grid className={columnStyles[fundingSummeryColumnName]} key={fundingSummeryColumnName}>
            <Typography className={classes.Title}>{fundingSummeryColumnName}</Typography>
            {payments.map((payment: any) => <Typography key={payment.id}
              className={classes.Value}>{columnValues[fundingSummeryColumnName](payment.id)}</Typography>)}
          </Grid>,
        )}
      </Grid>
    );
  }
;

export default observer(FundingSummary);
