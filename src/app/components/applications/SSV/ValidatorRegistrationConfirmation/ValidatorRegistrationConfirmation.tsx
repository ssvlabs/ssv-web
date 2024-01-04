import Grid from '@mui/material/Grid';
import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ENV } from '~lib/utils/envHelper';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import ErrorMessage from '~app/components/common/ErrorMessage';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import FundingSummary from '~app/components/common/FundingSummary';
import { useStyles } from './ValidatorRegistrationConfirmation.styles';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { RegisterValidator, SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { fromWei } from '~root/services/conversions.service';

const ValidatorRegistrationConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const { checkedCondition: acceptedTerms } = useTermsAndConditions();
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');
  const process: RegisterValidator | SingleCluster = processStore.process;
  const processFundingPeriod = 'fundingPeriod' in process ? process.fundingPeriod : 0;
  const actionButtonDefaultText = validatorStore.isMultiSharesMode ? `Register ${validatorStore.validatorsCount} Validators` : 'Register Validator';
  const [actionButtonText, setActionButtonText] = useState(actionButtonDefaultText);
  const [checkingUserInfo, setCheckingUserInfo] = useState(false);
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);

  const networkCost = propertyCostByPeriod(ssvStore.networkFee, processFundingPeriod);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, processFundingPeriod);
  let liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
  if (Number(liquidationCollateralCost) < ssvStore.minimumLiquidationCollateral) {
    liquidationCollateralCost = new Decimal(ssvStore.minimumLiquidationCollateral);
  }
  const amountOfSsv = formatNumberToUi(liquidationCollateralCost.add(networkCost).add(operatorsCost).toString());
  const totalAmountOfSsv = 'registerValidator' in process ? process.registerValidator?.depositAmount : amountOfSsv;
  const successPageNavigate = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.SUCCESS_PAGE),
    false: () => navigate(config.routes.SSV.VALIDATOR.SUCCESS_PAGE),
  };

  useEffect(() => {
    // In any case, even if checked before, check user info right before the registration
    if (!checkingUserInfo) {
      setCheckingUserInfo(true);
      ssvStore.userSyncInterval().finally(() => setCheckingUserInfo(false));
    }
  }, [String(ssvStore.approvedAllowance)]);

  useEffect(() => {
    setRegisterButtonDisabled(!acceptedTerms || checkingUserInfo);
  }, [acceptedTerms, checkingUserInfo]);

  const onRegisterValidatorClick = async () => {
    applicationStore.setIsLoading(true);
    setErrorMessage('');
    setActionButtonText('Waiting for confirmation...');
    const response = validatorStore.isMultiSharesMode ? await validatorStore.bulkRegistration() : await validatorStore.addNewValidator();
    if (response) {
      applicationStore.showTransactionPendingPopUp(false);
      successPageNavigate[`${processStore.secondRegistration}`]();
    } else {
      applicationStore.showTransactionPendingPopUp(false);
      setActionButtonText(actionButtonDefaultText);
    }
    applicationStore.setIsLoading(false);
  };

  const TotalSection = <Grid container>
    <Grid item xs>
      <NameAndAddress name={'Total'}/>
    </Grid>
    <Grid item style={{ marginBottom: 20 }}>
      <Grid
        className={classes.TotalSSV}>{'registerValidator' in process ? process.registerValidator?.depositAmount : Number(totalAmountOfSsv) * validatorStore.validatorsCount} SSV</Grid>
    </Grid>
    {Number(totalAmountOfSsv) > ssvStore.walletSsvBalance && (
      <Grid container item className={classes.InsufficientBalanceWrapper}>
        <Grid item xs>
          Insufficient SSV balance. There is not enough SSV in your wallet.
        </Grid>
        <Grid item>
          <LinkText text={'Need SSV?'} link={ENV().INSUFFICIENT_BALANCE_URL}/>
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
          totalAmount={totalAmountOfSsv}
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
          ? formatNumberToUi(ssvStore.getFeeForYear(fromWei(operator.fee)))
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

  if (!processStore.secondRegistration) screenBody.push(<FundingSummary
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
