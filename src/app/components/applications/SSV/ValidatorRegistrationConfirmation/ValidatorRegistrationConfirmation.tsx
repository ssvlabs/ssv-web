import Grid from '@mui/material/Grid';
import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import { equalsAddresses } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import ErrorMessage from '~app/components/common/ErrorMessage';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import FundingSummary from '~app/components/common/FundingSummary';
import { WalletStore } from '~app/common/stores/applications/SsvWeb';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import ProcessStore, { RegisterValidator, SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import {
  useStyles,
} from '~app/components/applications/SSV/ValidatorRegistrationConfirmation/ValidatorRegistrationConfirmation.styles';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading, setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { IOperator } from '~app/model/operator.model';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

const ValidatorRegistrationConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const { checkedCondition: acceptedTerms } = useTermsAndConditions();
  const validatorStore: ValidatorStore = stores.Validator;
  const walletStore: WalletStore = stores.Wallet;
  const [errorMessage, setErrorMessage] = useState('');
  const process: RegisterValidator | SingleCluster = processStore.process;
  const processFundingPeriod = 'fundingPeriod' in process ? process.fundingPeriod : 0;
  const actionButtonDefaultText = validatorStore.isMultiSharesMode ? `Register ${validatorStore.validatorsCount} Validators` : 'Register Validator';
  const [actionButtonText, setActionButtonText] = useState(actionButtonDefaultText);
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
  const dispatch = useAppDispatch();

  const networkCost = propertyCostByPeriod(ssvStore.networkFee, processFundingPeriod);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, processFundingPeriod);
  let liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
  if (Number(liquidationCollateralCost) < ssvStore.minimumLiquidationCollateral) {
    liquidationCollateralCost = new Decimal(ssvStore.minimumLiquidationCollateral);
  }
  const amountOfSsv: number = Number(liquidationCollateralCost.add(networkCost).add(operatorsCost).mul(validatorStore.validatorsCount));
  const totalAmountOfSsv: number = 'registerValidator' in process && process.registerValidator ? process.registerValidator?.depositAmount : amountOfSsv;
  const successPageNavigate = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.SUCCESS_PAGE),
    false: () => navigate(config.routes.SSV.VALIDATOR.SUCCESS_PAGE),
  };

  useEffect(() => {
    try {
      const hasWhitelistedOperator = Object.values(operatorStore.selectedOperators).some((operator: IOperator) => operator.address_whitelist && (operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST && !equalsAddresses(operator.address_whitelist, walletStore.accountAddress)));
      setRegisterButtonDisabled(!acceptedTerms || hasWhitelistedOperator);
    } catch (e: any) {
      setRegisterButtonDisabled(true);
      console.error(`Something went wrong: ${e.message}`);
    }
  }, [acceptedTerms]);

  const onRegisterValidatorClick = async () => {
    dispatch(setIsLoading(true));
    setErrorMessage('');
    setActionButtonText('Waiting for confirmation...');
    const response = validatorStore.isMultiSharesMode ? await validatorStore.bulkRegistration() : await validatorStore.addNewValidator();
    if (response) {
      successPageNavigate[`${processStore.secondRegistration}`]();
    } else {
      setActionButtonText(actionButtonDefaultText);
    }
    dispatch(setIsShowTxPendingPopup(false));
    dispatch(setIsLoading(false));
  };

  const TotalSection = <Grid container>
    <Grid item xs>
      <NameAndAddress name={'Total'}/>
    </Grid>
    <Grid item style={{ marginBottom: 20 }}>
      <Grid
        className={classes.TotalSSV}>{
        formatNumberToUi(totalAmountOfSsv)} SSV</Grid>
    </Grid>
    {totalAmountOfSsv > ssvStore.walletSsvBalance && (
      <Grid container item className={classes.InsufficientBalanceWrapper}>
        <Grid item xs>
          Insufficient SSV balance. There is not enough SSV in your wallet.
        </Grid>
        <Grid item>
          <LinkText text={'Need SSV?'} link={getStoredNetwork().insufficientBalanceUrl}/>
        </Grid>
      </Grid>
    )}

    {errorMessage && <ErrorMessage text={errorMessage}/>}

    <Grid container>
      <TermsAndConditionsCheckbox>
        <Button
          withAllowance
          text={actionButtonText}
          testId={'confirm-button'}
          onClick={onRegisterValidatorClick}
          disable={registerButtonDisabled}
          totalAmount={formatNumberToUi(totalAmountOfSsv)}
        />
      </TermsAndConditionsCheckbox>
    </Grid>
  </Grid>;

  const screenBody = [<Grid container>
    {!validatorStore.isMultiSharesMode && <>
      <Grid item className={classes.SubHeader}>Validator Public Key</Grid>
      <ValidatorKeyInput withBeaconcha address={validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey}/>
    </>}

    <Grid container item xs={12} className={classes.RowWrapper}>
      <Grid item className={classes.SubHeader}>Selected Operators</Grid>
      {Object.values(operatorStore.selectedOperators).map((operator: IOperator, index: number) => {
        const operatorCost = processStore.secondRegistration
          ? formatNumberToUi(getFeeForYear(fromWei(operator.fee)))
          : propertyCostByPeriod(fromWei(operator.fee), processFundingPeriod);
        const operatorCostPeriod = processStore.secondRegistration ? '/year' : `/${formatNumberToUi(processFundingPeriod, true)} days`;
        return (
          <Grid key={index} container item xs={12} className={classes.Row}>
            <Grid item>
              <OperatorDetails isFullOperatorName operator={operator}/>
            </Grid>
            <Grid item xs>
              <SsvAndSubTitle
                ssv={formatNumberToUi(operatorCost)}
                subText={operatorCostPeriod}
              />
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  </Grid>,
  ];

  if (!processStore.secondRegistration) screenBody.push(<FundingSummary networkCost={networkCost}
                                                                        liquidationCollateralCost={liquidationCollateralCost}/>);
  if (!processStore.secondRegistration) screenBody.push(TotalSection);

  const MainScreen = <BorderScreen
    blackHeader
    marginTop={32}
    sectionClass={classes.Section}
    header={translations.VALIDATOR.CONFIRMATION.TITLE}
    withoutNavigation={processStore.secondRegistration}
    body={screenBody}
    sideElementShowCondition={validatorStore.validatorsCount > 1}
    sideElement={<Grid className={classes.ValidatorHeaderCount}>{`${validatorStore.validatorsCount} Validators`}</Grid>}
  />;

  const SecondaryScreen = <BorderScreen
    marginTop={16}
    withoutNavigation
    sectionClass={classes.SecondaryScreenSection}
    body={[
      <Grid container>
        <Grid item className={classes.SubHeader}>Transaction Summary</Grid>
        <Grid container style={{ justifyContent: 'space-between' }}>
          <Grid item>
            <NameAndAddress name={'SSV Deposit'}/>
          </Grid>
          <Grid item>
            <NameAndAddress
              name={`${'registerValidator' in process ? process.registerValidator?.depositAmount : 0} SSV`}/>
          </Grid>
        </Grid>
      </Grid>,
      TotalSection,
    ]}
  />;

  if (processStore.secondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper
          type={0}
          header={'Cluster'}
        />
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
