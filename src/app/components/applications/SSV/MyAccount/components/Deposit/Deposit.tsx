import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Deposit/Deposit.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { fromWei, toWei } from '~root/services/conversions.service';
import { useAppSelector } from '~app/hooks/redux.hook';
import { depositOrWithdraw, getClusterRunWay } from '~root/services/cluster.service';
import { getAccountAddress, getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import AllowanceButton from '~app/components/AllowanceButton';

const Deposit = () => {
  const [inputValue, setInputValue] = useState('');
  const [wasAllowanceApproved, setAllowanceWasApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isMainnet = useAppSelector(getIsMainnet);
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const cluster = myAccountStore.ownerAddressClusters.find(({ clusterId }: {
    clusterId: string
  }) => clusterId === location.state.clusterId);
  const clusterBalance = fromWei(cluster.balance);

  async function depositSsv() {
    const success = await depositOrWithdraw({
      cluster,
      amount: inputValue.toString(),
      isContractWallet,
      accountAddress,
      liquidationCollateralPeriod: ssvStore.liquidationCollateralPeriod,
      minimumLiquidationCollateral: ssvStore.minimumLiquidationCollateral,
      callbackAfterExecution: myAccountStore.refreshOperatorsAndClusters,
      operation: EClusterOperation.DEPOSIT,
    });
    if (success) {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'success',
      });
      navigate(-1);
    } else {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'error',
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
    if (Number(value) > ssvStore.walletSsvBalance) value = String(ssvStore.walletSsvBalance);
    setInputValue(value);
  }

  function maxDeposit() {
    setInputValue(String(ssvStore.walletSsvBalance));
  }

  const newBalance = inputValue ? clusterBalance + Number(inputValue) : undefined;

  const bodySection = [
    (
      <Grid item container>
        <Grid container item xs={12} className={classes.BalanceWrapper}>
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <IntegerInput
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
              <Grid item className={classes.MaxButtonText}>SSV</Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.WalletBalance}>
            Wallet Balance: {formatNumberToUi(ssvStore.walletSsvBalance)} SSV
          </Grid>
        </Grid>
      </Grid>
    ),
    (
      <>
        <NewRemainingDays isInputFilled={!!inputValue} cluster={{ ...cluster, newRunWay: !inputValue ? undefined : getClusterRunWay({ ...cluster, balance: toWei(newBalance) }, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral) }}/>
      </>
    ),
  ];

  if (!cluster.validatorCount) {
    bodySection.pop();
  }

  return (
    <Grid container>
      <NewWhiteWrapper
        type={0}
        header={'Cluster'}
      />
      <BorderScreen
        withoutNavigation
        header={'Deposit'}
        body={bodySection}
        bottom={[(
          <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)}
                                      isMainnet={isMainnet}>
            <AllowanceButton
              withAllowance
              text={'Deposit'}
              onClick={depositSsv}
              disable={Number(inputValue) <= 0 || (isMainnet && !isChecked)}
              totalAmount={inputValue}
              allowanceApprovedCB={() => setAllowanceWasApproved(true)}
            />
          </TermsAndConditionsCheckbox>
        )]}
      />
    </Grid>
  );
};

export default observer(Deposit);
