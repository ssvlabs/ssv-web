import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/common/components/Status';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import PrimaryButton from '~app/common/components/PrimaryButton';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { useStyles } from './OperatorsReceipt.style';
import { roundNumber } from '~lib/utils/numbers';

type Props = {
    operators: any,
    header?: string,
    previousOperators?: any,
    currentOperators?: boolean,
};
const OperatorsReceipt = (props: Props) => {
    const stores = useStores();
    const { operators, header, previousOperators, currentOperators } = props;
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const classes = useStyles({ currentOperators });
    
    const oldOperatorsFee = previousOperators?.reduce(
        (previousValue: number, currentValue: IOperator) => previousValue + walletStore.fromWei(currentValue.fee),
        0,
    );

    const newOperatorsFee = operators.reduce(
        (previousValue: number, currentValue: IOperator) => previousValue + walletStore.fromWei(currentValue.fee),
        0,
    );

    const networkFee = ssvStore.getFeeForYear(ssvStore.networkFee);
    const operatorsYearlyFee = operatorStore.getFeePerYear(newOperatorsFee);
    const remainingDays = ssvStore.getRemainingDays({ newBurnRate: ssvStore.getNewAccountBurnRate(oldOperatorsFee, newOperatorsFee) });
    remainingDays;

    const body = [
      <Grid container item>
        <Grid container item className={classes.OperatorsWrapper}>
          {operators.map((operator: any, index: number) => {
                    return (
                      <Grid key={index} container item xs={12} className={classes.OperatorsDetails}>
                        <Grid item xs>
                          <OperatorDetails operator={operator} gray80={currentOperators} />
                        </Grid>
                        <Grid item>
                          <Status status={operator.status} />
                        </Grid>
                        <Grid item xs>
                          <SsvAndSubTitle gray80={currentOperators} ssv={operatorStore.getFeePerYear(walletStore.fromWei(operator.fee))} subText={'/year'} />
                        </Grid>
                      </Grid>
                    );
                })}
          <Grid container item justify={'space-between'}>
            <Grid item xs>
              <Typography className={classes.NetworkYearlyFee} style={{ marginRight: 8 }} component={'span'}>Network yearly fees</Typography>
              <Tooltip text={'Network yearly fee'} />
            </Grid>
            <Grid item>
              <Typography className={classes.NetworkYearlyFee}>{networkFee} SSV</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>,
      <Grid container item justify={'space-between'}>
        <Grid item>
          <Typography className={classes.NetworkYearlyFee}>Total Yearly Fee</Typography>
        </Grid>
        <Grid item>
          <SsvAndSubTitle bold gray80={currentOperators} ssv={roundNumber(networkFee + operatorsYearlyFee, 8)} subText={'~$757.5'} />
        </Grid>
      </Grid>,
      <Grid container item>
        <RemainingDays disableWarning={currentOperators} gray80={currentOperators} />
      </Grid>,
    ];
    if (!currentOperators) body.push(<PrimaryButton text={'Update Operators'} submitFunction={validatorStore.updateValidator} />);

    return (
      <BorderScreen
        body={body}
        header={header}
        withoutNavigation
        gray80={currentOperators}
        blackHeader={!currentOperators}
        sectionClass={classes.SectionWrapper}
      />
    );
};

export default OperatorsReceipt;
