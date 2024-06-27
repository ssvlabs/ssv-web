import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import config, { translations } from '~app/common/config';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import AllowanceButton from '~app/components/AllowanceButton';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { useStyles } from '~app/components/applications/SSV/ValidatorRegistrationConfirmation/ValidatorRegistrationConfirmation.styles';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import FundingSummary from '~app/components/common/FundingSummary';
import LinkText from '~app/components/common/LinkText';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import useFetchWalletBalance from '~app/hooks/useFetchWalletBalance';
import { useStores } from '~app/hooks/useStores';
import { IOperator } from '~app/model/operator.model';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getSelectedOperators, getSelectedOperatorsFee } from '~app/redux/operator.slice.ts';
import { getAccountAddress, getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import { canAccountUseOperator } from '~lib/utils/operatorMetadataHelper';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getLiquidationCollateralPerValidator } from '~root/services/validator.service';
import { NewValidatorRouteState } from '~app/Routes';
import { getIsClusterSelected } from '~app/redux/account.slice.ts';
import { useQuery } from '@tanstack/react-query';

const ValidatorRegistrationConfirmation = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const accountAddress = useAppSelector(getAccountAddress);
  const isMainnet = useAppSelector(getIsMainnet);
  const { networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const stores = useStores();
  const { walletSsvBalance } = useFetchWalletBalance();
  const classes = useStyles();
  const validatorStore: ValidatorStore = stores.Validator;
  const selectedOperatorsFee = useAppSelector(getSelectedOperatorsFee);
  const selectedOperators = useAppSelector(getSelectedOperators);
  const isSecondRegistration = useAppSelector(getIsClusterSelected);

  const location: Location<NewValidatorRouteState> = useLocation();

  const newFundingPeriod = location.state.newValidatorFundingPeriod ?? 0;

  const actionButtonDefaultText = validatorStore.isMultiSharesMode ? `Register ${validatorStore.validatorsCount} Validators` : 'Register Validator';
  const [actionButtonText, setActionButtonText] = useState(actionButtonDefaultText);
  const [isLoading, setIsLoading] = useState(false);

  const networkCost = propertyCostByPeriod(networkFee, newFundingPeriod);
  const operatorsCost = propertyCostByPeriod(selectedOperatorsFee, newFundingPeriod);
  const liquidationCollateralCost = getLiquidationCollateralPerValidator({
    operatorsFee: selectedOperatorsFee,
    networkFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
    validatorsCount: validatorStore.validatorsCount
  });
  const amountOfSsv: number = Number(liquidationCollateralCost.add(networkCost).add(operatorsCost).mul(validatorStore.validatorsCount));
  const totalAmountOfSsv: number = location.state.newValidatorDepositAmount ?? amountOfSsv;

  const successPageNavigate = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.SUCCESS_PAGE),
    false: () => navigate(config.routes.SSV.VALIDATOR.SUCCESS_PAGE)
  };

  const { data: hasPrivateOperators } = useQuery({
    queryKey: ['has-private-operators', selectedOperators, accountAddress],
    queryFn: async () => {
      const result = await Promise.all(Object.values(selectedOperators).map((operator) => canAccountUseOperator(accountAddress, operator)));
      return result.some((isUsable) => isUsable === false);
    }
  });

  useEffect(() => {
    try {
      setRegisterButtonDisabled(isMainnet && !isChecked);
    } catch (e: any) {
      setRegisterButtonDisabled(true);
      console.error(`Something went wrong: ${e.message}`);
    }
  }, [isMainnet, isChecked]);

  const onRegisterValidatorClick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setActionButtonText('Waiting for confirmation...');
    const response = await validatorStore.addNewValidator({
      accountAddress,
      isContractWallet,
      isBulk: validatorStore.isMultiSharesMode,
      operators: Object.values(selectedOperators),
      networkFee,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral,
      selectedOperatorsFee,
      depositAmount: totalAmountOfSsv,
      fundingPeriod: newFundingPeriod,
      dispatch
    });
    if (response && !isContractWallet) {
      successPageNavigate[`${isSecondRegistration}`]();
    } else {
      setActionButtonText(actionButtonDefaultText);
    }
    setIsLoading(false);
  };

  const TotalSection = (
    <Grid container>
      <Grid item xs>
        <NameAndAddress name={'Total'} />
      </Grid>
      <Grid item style={{ marginBottom: 20 }}>
        <Grid className={classes.TotalSSV}>{formatNumberToUi(totalAmountOfSsv)} SSV</Grid>
      </Grid>
      {totalAmountOfSsv > walletSsvBalance && (
        <Grid container item className={classes.InsufficientBalanceWrapper}>
          <Grid item xs>
            Insufficient SSV balance. There is not enough SSV in your wallet.
          </Grid>
          <Grid item>
            <LinkText text={'Need SSV?'} link={getStoredNetwork().insufficientBalanceUrl} />
          </Grid>
        </Grid>
      )}

      {errorMessage && <ErrorMessage text={errorMessage} />}

      <Grid container>
        <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
          <AllowanceButton
            withAllowance
            isLoading={isLoading}
            text={actionButtonText}
            onClick={onRegisterValidatorClick}
            disable={registerButtonDisabled || Boolean(hasPrivateOperators)}
            totalAmount={totalAmountOfSsv.toString()}
          />
        </TermsAndConditionsCheckbox>
      </Grid>
    </Grid>
  );

  const screenBody = [
    <Grid container>
      {!validatorStore.isMultiSharesMode && (
        <>
          <Grid item className={classes.SubHeader}>
            Validator Public Key
          </Grid>
          <ValidatorKeyInput withBeaconcha address={validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey} />
        </>
      )}

      <Grid container item xs={12} className={classes.RowWrapper}>
        <Grid item className={classes.SubHeader}>
          Selected Operators
        </Grid>
        {Object.values(selectedOperators).map((operator: IOperator, index: number) => {
          const operatorCost = isSecondRegistration ? formatNumberToUi(getFeeForYear(fromWei(operator.fee))) : propertyCostByPeriod(fromWei(operator.fee), newFundingPeriod);
          const operatorCostPeriod = isSecondRegistration ? '/year' : `/${formatNumberToUi(newFundingPeriod, true)} days`;
          return (
            <Grid key={index} container item xs={12} className={classes.Row}>
              <Grid item>
                <OperatorDetails isFullOperatorName operator={operator} />
              </Grid>
              <Grid item xs>
                <SsvAndSubTitle ssv={formatNumberToUi(operatorCost)} subText={operatorCostPeriod} />
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  ];

  if (!isSecondRegistration) screenBody.push(<FundingSummary networkCost={networkCost} liquidationCollateralCost={liquidationCollateralCost} days={newFundingPeriod} />);
  if (!isSecondRegistration) screenBody.push(TotalSection);

  const MainScreen = (
    <BorderScreen
      blackHeader
      marginTop={32}
      sectionClass={classes.Section}
      header={translations.VALIDATOR.CONFIRMATION.TITLE}
      withoutNavigation={isSecondRegistration}
      body={screenBody}
      sideElementShowCondition={validatorStore.validatorsCount > 1}
      sideElement={<Grid className={classes.ValidatorHeaderCount}>{`${validatorStore.validatorsCount} Validators`}</Grid>}
    />
  );

  const SecondaryScreen = (
    <BorderScreen
      marginTop={16}
      withoutNavigation
      sectionClass={classes.SecondaryScreenSection}
      body={[
        <Grid container>
          <Grid item className={classes.SubHeader}>
            Transaction Summary
          </Grid>
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid item>
              <NameAndAddress name={'SSV Deposit'} />
            </Grid>
            <Grid item>
              <NameAndAddress name={`${totalAmountOfSsv} SSV`} />
            </Grid>
          </Grid>
        </Grid>,
        TotalSection
      ]}
    />
  );

  if (isSecondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper type={0} header={'Cluster'} />
        <Grid container>
          <Grid item xs={12}>
            {MainScreen}
          </Grid>
          <Grid item xs={12}>
            {SecondaryScreen}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return MainScreen;
};

export default observer(ValidatorRegistrationConfirmation);
