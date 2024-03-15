import React, { useState } from 'react';
import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText/LinkText';
import FundingSummary from '~app/components/common/FundingSummary';
import { ValidatorStore } from '~app/common/stores/applications/SsvWeb';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/FundingPeriod/FundingPeriod.styles';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { RegisterValidator } from '~app/model/processes.model';

const FundingPeriod = () => {
  const options = [
    { id: 1, timeText: '6 Months', days: 182.5 },
    { id: 2, timeText: '1 Year', days: 365 },
    { id: 3, timeText: 'Custom Period', days: 365 },
  ];
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  // const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const [customPeriod, setCustomPeriod] = useState(config.GLOBAL_VARIABLE.DEFAULT_CLUSTER_PERIOD);
  const [checkedOption, setCheckedOption] = useState(options[1]);
  const timePeriodNotValid = customPeriod < config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM;

  const process: RegisterValidator = processStore.process as RegisterValidator;
  const checkBox = (option: any) => setCheckedOption(option);
  const isCustomPayment = checkedOption.id === 3;
  const periodOfTime = isCustomPayment ? customPeriod : checkedOption.days;
  const networkCost = propertyCostByPeriod(ssvStore.networkFee, periodOfTime);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, periodOfTime);
  let liquidationCollateralCost = Number(new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod));
  if ( Number(liquidationCollateralCost) < ssvStore.minimumLiquidationCollateral ) {
    liquidationCollateralCost = ssvStore.minimumLiquidationCollateral;
  }
  const totalCost = new Decimal(operatorsCost).add(networkCost).add(liquidationCollateralCost);
  const insufficientBalance = totalCost.comparedTo(ssvStore.walletSsvBalance) === 1;
  const showLiquidationError = isCustomPayment && !insufficientBalance && timePeriodNotValid;
  const totalAmount = formatNumberToUi(Number(totalCost.mul(validatorStore.validatorsCount).toFixed(18)));

  const getDisableStateCondition = () => {
    if (isCustomPayment) {
      return customPeriod <= 0 || isNaN(customPeriod) || insufficientBalance;
    }
    return insufficientBalance;
  };

  const buttonDisableCondition = getDisableStateCondition();
  const isChecked = (id: number) => checkedOption.id === id;

  const moveToNextPage = () => {
    process.fundingPeriod = periodOfTime;
    navigate(config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
  };

  return (
      <BorderScreen
          blackHeader
          withConversion
          sectionClass={classes.Section}
          header={'Select your validator funding period'}
          body={[
            <Grid container>
              <Typography className={classes.Text}>The SSV amount you deposit will determine your validator operational
                runway <br/>
                (You can always manage it later by withdrawing or depositing more funds).</Typography>
              <Grid container item style={{ gap: 16 }}>
                {options.map((option, index) => {
                  const isCustom = option.id === 3;
                  return <Grid key={index} container item
                               className={`${classes.Box} ${isChecked(option.id) ? classes.SelectedBox : ''}`}
                               onClick={() => checkBox(option)}>
                    <Grid container item xs style={{ gap: 16, alignItems: 'center' }}>
                      {isChecked(option.id) ? <Grid item className={classes.CheckedCircle}/> :
                          <Grid item className={classes.CheckCircle}/>}
                      <Grid item
                            className={isChecked(option.id) ? classes.SsvPrice : classes.TimeText}>{option.timeText}</Grid>
                    </Grid>
                    <Grid item
                          className={classes.SsvPrice}>{formatNumberToUi(Number(propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, isCustom ? customPeriod : option.days) * validatorStore.validatorsCount))} SSV</Grid>
                    {isCustom && <TextInput value={customPeriod}
                                            onChangeCallback={(e: any) => setCustomPeriod(Number(e.target.value))}
                                            extendClass={classes.DaysInput} withSideText sideText={'Days'}/>}
                  </Grid>;
                })}
                {insufficientBalance && <ErrorMessage extendClasses={classes.ErrorBox} text={
                  <Grid container style={{ gap: 8 }}>
                    <Grid item>
                      Insufficient SSV balance. Acquire further SSV or pick a different amount.
                    </Grid>
                    <Grid container item xs>
                      <LinkText className={classes.Link} text={'Need SSV?'} link={getStoredNetwork().insufficientBalanceUrl}/>
                    </Grid>
                  </Grid>
                }
                />}
                {showLiquidationError && <ErrorMessage extendClasses={classes.ErrorBox} text={
                    <Grid>This period is low and could put your validator at risk. To avoid liquidation please input a longer period.<LinkText text={'Learn more on liquidations'}
                                          link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}/></Grid>
                }/>}
              </Grid>
            </Grid>,
            <FundingSummary liquidationCollateralCost={liquidationCollateralCost} days={isCustomPayment ? customPeriod : checkedOption.days}/>,
            <Grid container>
              <Grid container item style={{ justifyContent: 'space-between', marginTop: -8, marginBottom: 20 }}>
                <Typography className={classes.Text} style={{ marginBottom: 0 }}>Total</Typography>
                <Typography className={classes.SsvPrice} style={{ marginBottom: 0 }}>{totalAmount} SSV</Typography>
              </Grid>
              <PrimaryButton children={'Next'} submitFunction={moveToNextPage} disable={buttonDisableCondition}/>
            </Grid>,
          ]}
      />
  );
};
export default observer(FundingPeriod);
