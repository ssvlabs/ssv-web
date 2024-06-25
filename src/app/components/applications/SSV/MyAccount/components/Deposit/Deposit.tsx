import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllowanceButton from '~app/components/AllowanceButton';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Deposit/Deposit.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import IntegerInput from '~app/components/common/IntegerInput';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import useFetchWalletBalance from '~app/hooks/useFetchWalletBalance';
import { getSelectedCluster } from '~app/redux/account.slice';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress, getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getClusterRunWay } from '~root/services/cluster.service';
import { depositOrWithdraw } from '~root/services/clusterContract.service';
import { fromWei, toWei } from '~root/services/conversions.service';

const Deposit = () => {
  const [inputValue, setInputValue] = useState('');
  const [wasAllowanceApproved, setAllowanceWasApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { walletSsvBalance } = useFetchWalletBalance();

  const navigate = useNavigate();
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const cluster = useAppSelector(getSelectedCluster);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const dispatch = useAppDispatch();
  const clusterBalance = fromWei(cluster.balance);

  async function depositSsv() {
    const success = await depositOrWithdraw({
      cluster,
      amount: inputValue.toString(),
      isContractWallet,
      accountAddress,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral,
      operation: EClusterOperation.DEPOSIT,
      dispatch
    });
    if (success && !isContractWallet) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'success'
      });
      navigate(-1);
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'error'
      });
    }
    setInputValue('');
  }

  function inputHandler(e: any) {
    let value = e.target.value.trim();
    if (value === '') {
      setInputValue(value);
      return;
    }
    if (Number(value) > walletSsvBalance) value = String(walletSsvBalance);
    setInputValue(value);
  }

  function maxDeposit() {
    setInputValue(String(walletSsvBalance));
  }

  const newBalance = inputValue ? clusterBalance + Number(inputValue) : undefined;

  const bodySection = [
    <Grid item container>
      <Grid container item xs={12} className={classes.BalanceWrapper}>
        <Grid item container xs={12}>
          <Grid item xs={6}>
            <IntegerInput
              // @ts-ignore
              min={'0'}
              type="number"
              value={inputValue}
              placeholder={'0.0'}
              onChange={inputHandler}
              disabled={wasAllowanceApproved}
              className={classes.Balance}
            />
          </Grid>
          <Grid item container xs={6} className={classes.MaxButtonWrapper}>
            <Grid item onClick={maxDeposit} className={classes.MaxButton}>
              MAX
            </Grid>
            <Grid item className={classes.MaxButtonText}>
              SSV
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.WalletBalance}>
          Wallet Balance: {formatNumberToUi(walletSsvBalance)} SSV
        </Grid>
      </Grid>
    </Grid>,
    <>
      <NewRemainingDays
        isInputFilled={!!inputValue}
        cluster={{
          ...cluster,
          newRunWay: !inputValue
            ? undefined
            : getClusterRunWay(
                {
                  ...cluster,
                  balance: toWei(newBalance)
                },
                liquidationCollateralPeriod,
                minimumLiquidationCollateral
              )
        }}
      />
    </>
  ];

  if (!cluster.validatorCount) {
    bodySection.pop();
  }

  return (
    <Grid container>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
      <BorderScreen
        withoutNavigation
        header={'Deposit'}
        body={bodySection}
        bottom={[
          <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
            <AllowanceButton
              withAllowance
              text={'Deposit'}
              onClick={depositSsv}
              disable={Number(inputValue) <= 0 || (isMainnet && !isChecked)}
              totalAmount={inputValue}
              allowanceApprovedCB={() => setAllowanceWasApproved(true)}
            />
          </TermsAndConditionsCheckbox>
        ]}
      />
    </Grid>
  );
};

export default Deposit;
