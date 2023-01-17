import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './FundingPeriod.styles';
import TextInput from '~app/components/common/TextInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText/LinkText';
import FundingSummary from '~app/components/common/FundingSummary';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';

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
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const [checkedOption, setCheckedOption] = useState(options[0]);
  const [customPeriod, setCustomPeriod] = useState(1);

  const checkBox = (option: any) => setCheckedOption(option);

  const isCustomPayment = checkedOption.id === 3;
  const periodOfTime = isCustomPayment ? customPeriod : checkedOption.days;
  const networkCost = propertyCostByPeriod(ssvStore.networkFee, periodOfTime);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, periodOfTime);
  const liquidationCollateralCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee + ssvStore.networkFee, ssvStore.liquidationCollateralPeriod);

  const totalCost = operatorsCost + networkCost + liquidationCollateralCost;

  const isChecked = (id: number) => checkedOption.id === id;

  const moveToNextPage = () => {
    validatorStore.fundingPeriod = periodOfTime;
    navigate(config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE);
  };

  const InsufficientBalance = totalCost > ssvStore.walletSsvBalance;
  const riskOfLiquidation = periodOfTime < 30;

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
                          className={classes.SsvPrice}>{formatNumberToUi(propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, isCustom ? customPeriod : option.days))} SSV</Grid>
                    {isCustom && <TextInput value={customPeriod}
                                            onChangeCallback={(e: any) => setCustomPeriod(Number(e.target.value))}
                                            extendClass={classes.DaysInput} withSideText sideText={'Days'}/>}
                  </Grid>;
                })}
                {InsufficientBalance && <ErrorMessage extendClasses={classes.ErrorBox} text={
                  <Grid container style={{ gap: 8 }}>
                    <Grid item>
                      Insufficient SSV balance. Acquire further SSV or pick a different amount.
                    </Grid>
                    <Grid container item xs>
                      <LinkText className={classes.Link} text={'Need SSV?'} link={'https://faucet.ssv.network'}/>
                    </Grid>
                  </Grid>
                }
                />}
                {riskOfLiquidation && <ErrorMessage extendClasses={classes.ErrorBox} text={
                    <Grid>This funding period will put your validator at risk of liquidation. To avoid liquidation
                      please pick a bigger funding period. <LinkText text={'Read more on liquidations'}
                                          link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}/></Grid>
                }/>}
              </Grid>
            </Grid>,
            <FundingSummary days={isCustomPayment ? customPeriod : checkedOption.days}/>,
            <Grid container>
              <Grid container item style={{ justifyContent: 'space-between', marginTop: -8, marginBottom: 20 }}>
                <Typography className={classes.Text} style={{ marginBottom: 0 }}>Total</Typography>
                <Typography className={classes.SsvPrice} style={{ marginBottom: 0 }}>{formatNumberToUi(totalCost)} SSV</Typography>
              </Grid>
              <PrimaryButton text={'Next'} submitFunction={moveToNextPage} disable={InsufficientBalance}/>
            </Grid>,
          ]}
      />
  );
};
export default observer(FundingPeriod);
