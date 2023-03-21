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
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import LinkText from '~app/components/common/LinkText/LinkText';
import FundingSummary from '~app/components/common/FundingSummary';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';

const ReactivateCluster = () => {
  const options = [
    { id: 1, timeText: '6 Months', days: 182.5 },
    { id: 2, timeText: '1 Year', days: 365 },
    { id: 3, timeText: 'Custom Period', days: 365 },
  ];
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [customPeriod, setCustomPeriod] = useState(1);
  const [checkedOption, setCheckedOption] = useState(options[1]);
  const timePeriodNotValid = customPeriod < 30;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;

  const checkBox = (option: any) => setCheckedOption(option);

  const isCustomPayment = checkedOption.id === 3;
  const operatorsFee = Object.values(cluster.operators).reduce(
        (previousValue: number, currentValue: any) => previousValue + walletStore.fromWei(currentValue.fee),
        0,
    );
  const periodOfTime = isCustomPayment ? customPeriod : checkedOption.days;
  const networkCost = propertyCostByPeriod(ssvStore.networkFee, periodOfTime);
  const operatorsCost = propertyCostByPeriod(operatorsFee, periodOfTime);
  const liquidationCollateralCost = new Decimal(operatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);

  const totalCost = new Decimal(operatorsCost).add(networkCost).add(liquidationCollateralCost);
  const insufficientBalance = totalCost.comparedTo(ssvStore.walletSsvBalance) === 1;
  const showLiquidationError = isCustomPayment && insufficientBalance && timePeriodNotValid;

  const isChecked = (id: number) => checkedOption.id === id;

  const reactivateCluster = async () => {
    applicationStore.setIsLoading(true);
    const response = await validatorStore.reactivateCluster(totalCost.toString());
    applicationStore.showTransactionPendingPopUp(false);
    applicationStore.setIsLoading(false);
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
                                                                                     link={'http://cblasdasdsa'}/> due
                  to insufficient balance for its operational
                  <br/> costs. To resume its operation, you must deposit sufficient funds required for
                  <br/> its reactivation. <LinkText withoutUnderline text={'Learn more on liquidations.'}
                                                    link={'http://cblasdasdsa'}/></Typography>
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
                            className={classes.SsvPrice}>{formatNumberToUi(propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, isCustom ? customPeriod : option.days))} SSV</Grid>
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
                        <LinkText className={classes.Link} text={'Need SSV?'} link={'https://faucet.ssv.network'}/>
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
                <PrimaryButton text={'Next'} submitFunction={reactivateCluster}
                               disable={insufficientBalance || customPeriod <= 0 || isNaN(customPeriod)}/>
              </Grid>,
            ]}
        />
      </Grid>
  );
};
export default observer(ReactivateCluster);
