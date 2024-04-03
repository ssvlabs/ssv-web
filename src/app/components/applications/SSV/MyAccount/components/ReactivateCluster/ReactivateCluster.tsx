import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './ReactivateCluster.styles';
import TextInput from '~app/components/common/TextInput';
import Button from '~app/components/common/Button/Button';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText/LinkText';
import FundingSummary from '~app/components/common/FundingSummary';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { fromWei } from '~root/services/conversions.service';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsLoading, setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { SingleCluster } from '~app/model/processes.model';
import { getLiquidationCollateralPerValidator } from '~root/services/validator.service';
import { getAccountAddress, getIsContractWallet } from '~app/redux/wallet.slice';

const options = [
  { id: 1, timeText: '6 Months', days: 182.5 },
  { id: 2, timeText: '1 Year', days: 365 },
  { id: 3, timeText: 'Custom Period', days: 365 },
];

const ReactivateCluster = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const [customPeriod, setCustomPeriod] = useState(config.GLOBAL_VARIABLE.DEFAULT_CLUSTER_PERIOD);
  const [checkedOption, setCheckedOption] = useState(options[1]);
  const dispatch = useAppDispatch();
  const timePeriodNotValid = customPeriod < 30;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;
  const validatorsCount = cluster.validatorCount || 1;
  const checkBox = (option: any) => setCheckedOption(option);

  const isCustomPayment = checkedOption.id === 3;
  const operatorsFee = Object.values(cluster.operators).reduce(
    (previousValue: number, currentValue: any) => previousValue + fromWei(currentValue.fee),
    0,
  );
  const periodOfTime = isCustomPayment ? customPeriod : checkedOption.days;
  const networkCost = propertyCostByPeriod(ssvStore.networkFee, periodOfTime);
  const operatorsCost = propertyCostByPeriod(operatorsFee, periodOfTime);

  let liquidationCollateralCost = getLiquidationCollateralPerValidator({
    operatorsFee,
    networkFee: ssvStore.networkFee,
    liquidationCollateralPeriod: ssvStore.liquidationCollateralPeriod,
    validatorsCount,
    minimumLiquidationCollateral: ssvStore.minimumLiquidationCollateral,
  });
  const totalCost = new Decimal(operatorsCost).add(networkCost).add(liquidationCollateralCost).mul(validatorsCount);
  const insufficientBalance = totalCost.comparedTo(ssvStore.walletSsvBalance) === 1;
  const showLiquidationError = isCustomPayment && !insufficientBalance && timePeriodNotValid;
  const disableCondition = insufficientBalance || customPeriod <= 0 || isNaN(customPeriod);

  const isChecked = (id: number) => checkedOption.id === id;

  const reactivateCluster = async () => {
    dispatch(setIsLoading(true));
    const response = await validatorStore.reactivateCluster({ accountAddress, isContractWallet, amount: totalCost.toString() });
    dispatch(setIsShowTxPendingPopup(false));
    dispatch(setIsLoading(false));
    if (response) navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
  };


  return (
    <Grid container>
      <NewWhiteWrapper
        type={0}
        header={'Cluster'}
      />
      <BorderScreen
        blackHeader
        withConversion
        withoutNavigation
        sectionClass={classes.Section}
        header={'Reactivate Cluster'}
        body={[
          <Grid container>
            <Typography className={classes.Text}>Your cluster has been <LinkText withoutUnderline
                                                                                 text={'liquidated'}
                                                                                 link={config.links.REACTIVATION_LINK}/> due
              to insufficient balance for its operational
              <br/> costs. To resume its operation, you must deposit sufficient funds required for
              <br/> its reactivation. <LinkText withoutUnderline text={'Learn more on liquidations.'}
                                                link={config.links.MORE_ON_LIQUIDATION_LINK}/></Typography>
            <Typography className={classes.BoxesHeader}>Select your cluster funding period</Typography>
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
                        className={classes.SsvPrice}>{formatNumberToUi(propertyCostByPeriod(operatorsFee, isCustom ? customPeriod : option.days) * validatorsCount)} SSV</Grid>
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
                    <LinkText className={classes.Link} text={'Need SSV?'}
                              link={getStoredNetwork().insufficientBalanceUrl}/>
                  </Grid>
                </Grid>
              }
              />}
              {showLiquidationError && <ErrorMessage extendClasses={classes.ErrorBox} text={
                <Grid>This funding period will put your validator at risk of liquidation. To avoid liquidation
                  please pick a bigger funding period. <LinkText text={'Read more on liquidations'}
                                                                 link={'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations'}/></Grid>
              }/>}
            </Grid>
          </Grid>,
          <FundingSummary
            validatorsCount={validatorsCount}
            networkCost={networkCost}
            operatorsCost={operatorsCost}
            liquidationCollateralCost={liquidationCollateralCost}
            days={isCustomPayment ? customPeriod : checkedOption.days}
          />,
          <Grid container>
            <Grid container item style={{ justifyContent: 'space-between', marginTop: -8, marginBottom: 20 }}>
              <Typography className={classes.Text} style={{ marginBottom: 0 }}>Total</Typography>
              <Typography className={classes.SsvPrice}
                          style={{ marginBottom: 0 }}>{formatNumberToUi(totalCost.toFixed(18))} SSV</Typography>
            </Grid>
            <Button
              withAllowance
              text={'Next'}
              onClick={reactivateCluster}
              disable={disableCondition}
              totalAmount={disableCondition ? '0' : formatNumberToUi(totalCost.toFixed(18))}
            />
          </Grid>,
        ]}
      />
    </Grid>
  );
};
export default observer(ReactivateCluster);
