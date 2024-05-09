import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config, { translations } from '~app/common/config';
import { useAppSelector } from '~app/hooks/redux.hook';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { fromWei, toWei } from '~root/services/conversions.service';
import { depositOrWithdraw, getClusterRunWay } from '~root/services/cluster.service';
import { getAccountAddress, getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { ICluster } from '~app/model/cluster.model';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import ErrorButton from '~app/atomicComponents/ErrorButton';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import CheckBox from '~app/components/common/CheckBox';
import { ButtonSize } from '~app/enums/Button.enum';

const ClusterFlow = ({ cluster, callbackAfterExecution, minimumLiquidationCollateral, liquidationCollateralPeriod }: {
  cluster: ICluster;
  callbackAfterExecution: Function;
  minimumLiquidationCollateral: number;
  liquidationCollateralPeriod: number;
}) => {
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const classes = useStyles();
  const navigate = useNavigate();
  const clusterBalance = fromWei(cluster.balance);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserAgreed, setHasUserAgreed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [checkBoxText, setCheckBoxText] = useState('');
  const [isClusterLiquidation, setIsClusterLiquidation] = useState(false);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [newBalance, setNewBalance] = useState<string | number>(clusterBalance);
  const [withdrawValue, setWithdrawValue] = useState<number | string>('');
  const [buttonDisableCondition, setButtonDisableCondition] = useState(false);
  const [buttonText, setButtonText] = useState(translations.VALIDATOR.WITHDRAW.BUTTON.WITHDRAW);

  useEffect(() => {
    if (getClusterRunWay({
      ...cluster,
      balance: toWei(newBalance),
    }, liquidationCollateralPeriod, minimumLiquidationCollateral) > config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM && hasUserAgreed) {
      setHasUserAgreed(false);
    }

    const balance = (withdrawValue ? clusterBalance - Number(withdrawValue) : clusterBalance).toFixed(18);
    const runWay = getClusterRunWay({
      ...cluster,
      balance: toWei(balance),
    }, liquidationCollateralPeriod, minimumLiquidationCollateral);
    const showCheckboxCondition = runWay <= config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM && !!cluster.validatorCount;

    setNewBalance(balance);
    setIsClusterLiquidation(runWay <= 0 && !!cluster.validatorCount);
    setShowCheckBox(showCheckboxCondition);
    setButtonDisableCondition(runWay <= config.GLOBAL_VARIABLE.CLUSTER_VALIDITY_PERIOD_MINIMUM && !!cluster.validatorCount && !hasUserAgreed || Number(withdrawValue) === 0 || (isMainnet && !isChecked));

    setCheckBoxText(isClusterLiquidation && showCheckboxCondition ? translations.VALIDATOR.WITHDRAW.CHECKBOX.LIQUIDATE_MY_CLUSTER : translations.VALIDATOR.WITHDRAW.CHECKBOX.LIQUIDATION_RISK);
    if (runWay <= 0 && !!cluster.validatorCount) {
      setButtonText(translations.VALIDATOR.WITHDRAW.BUTTON.LIQUIDATE_MY_CLUSTER);
    } else if (withdrawValue === clusterBalance) {
      setButtonText(translations.VALIDATOR.WITHDRAW.BUTTON.WITHDRAW_ALL);
    } else {
      setButtonText(translations.VALIDATOR.WITHDRAW.BUTTON.WITHDRAW);
    }
  }, [withdrawValue, hasUserAgreed, isMainnet, isChecked]);

  const withdrawSsv = async () => {
    setIsLoading(true);
    const success = await depositOrWithdraw({
      cluster,
      amount: withdrawValue.toString(),
      accountAddress,
      isContractWallet,
      minimumLiquidationCollateral,
      liquidationCollateralPeriod,
      callbackAfterExecution,
      operation: isClusterLiquidation ? EClusterOperation.LIQUIDATE : EClusterOperation.WITHDRAW,
    });
    if (success) {
      navigate(-1);
    }
    setIsLoading(false);
  };

  function inputHandler(e: any) {
    const value = e.target.value;
    if (value > clusterBalance) {
      setWithdrawValue(clusterBalance);
    } else if (value < 0) {
      setWithdrawValue(0);
    } else if (value === '') {
      setWithdrawValue(value);
    } else {
      setWithdrawValue(Number(value));
    }
  }

  function maxValue() {
    setWithdrawValue(Number(clusterBalance));
  }

  const Button = isClusterLiquidation ? ErrorButton : PrimaryButton;

  const secondBorderScreen = [(
    <Grid item container>
      <Grid container item xs={12} className={classes.BalanceWrapper}>
        <Grid item container xs={12}>
          <Grid item xs={6}>
            <IntegerInput
              type="number"
              value={withdrawValue}
              placeholder={'0.0'}
              onChange={inputHandler}
              className={classes.Balance}
            />
          </Grid>
          <Grid item container xs={6} className={classes.MaxButtonWrapper}>
            <Grid item onClick={maxValue} className={classes.MaxButton}>
              MAX
            </Grid>
            <Grid item className={classes.MaxButtonText}>SSV</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ), (
    <NewRemainingDays
      withdrawState
      isInputFilled={!!withdrawValue}
      cluster={{
        ...cluster,
        newRunWay: !withdrawValue ? undefined : getClusterRunWay({
          ...cluster,
          balance: toWei(newBalance),
        }, liquidationCollateralPeriod, minimumLiquidationCollateral),
      }}/>
  )];

  if (!cluster.validatorCount) {
    secondBorderScreen.pop();
  }

  return (
    <BorderScreen
      marginTop={0}
      withoutNavigation
      header={'Withdraw'}
      body={secondBorderScreen}
      bottom={[
        <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)}
                                    isMainnet={isMainnet}>
          <div>
            {showCheckBox && (
              <CheckBox toggleIsChecked={() => setHasUserAgreed(!hasUserAgreed)} text={checkBoxText}
                        isChecked={hasUserAgreed}/>
            )}
            <Button
              text={buttonText}
              onClick={withdrawSsv}
              isLoading={isLoading}
              isDisabled={buttonDisableCondition}
              size={ButtonSize.XL}/>
          </div>
        </TermsAndConditionsCheckbox>,
      ]}
    />
  );
};

export default ClusterFlow;
