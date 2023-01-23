import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useNavigate } from 'react-router-dom';
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
import { formatNumberToUi, propertyCostByPeriod } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';

const ValidatorRegistrationConfirmation = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');
  // const [checked, selectCheckBox] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Run validator');

  const networkCost = propertyCostByPeriod(ssvStore.networkFee, validatorStore.fundingPeriod);
  const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, validatorStore.fundingPeriod);
  const liquidationCollateralCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee + ssvStore.networkFee, ssvStore.liquidationCollateralPeriod);
  const totalAmountOfSsv = formatNumberToUi(networkCost + operatorsCost + liquidationCollateralCost);

  const onRegisterValidatorClick = async () => {
    applicationStore.setIsLoading(true);
    setErrorMessage('');
    setActionButtonText('Waiting for confirmation...');
    const selectedOperatorsKeys = Object.values(operatorStore.selectedOperators);
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < selectedOperatorsKeys.length; i += 1) {
      // const operatorValidators = await operatorStore.getOperatorValidatorsCount(selectedOperatorsKeys[i].id);
      // if (!operatorStore.isOperatorRegistrable(operatorValidators)) {
      //   setErrorMessage(`Operator ${selectedOperatorsKeys[i].name} has reached it’s validator’s limit cap. Please choose a different operator.`);
      //   setActionButtonText('Run validator');
      //   applicationStore.setIsLoading(false);
      //   return;
      // }
    }

    console.log(`mode is: ${  validatorStore.registrationMode}`);
    const response = await validatorStore.addNewValidator();
    if (response) {
      operatorStore.unselectAllOperators();
      applicationStore.showTransactionPendingPopUp(false);
      navigate(config.routes.SSV.VALIDATOR.SUCCESS_PAGE);
    } else {
      applicationStore.showTransactionPendingPopUp(false);
      setActionButtonText('Run validator');
    }
  };

  return (
    <BorderScreen
      blackHeader
      sectionClass={classes.Section}
      header={translations.VALIDATOR.CONFIRMATION.TITLE}
      body={[
        <Grid container>
          <Grid item className={classes.SubHeader}>Validator Public Key</Grid>
          <ValidatorKeyInput withBeaconcha address={validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey} />
          <Grid container item xs={12} className={classes.RowWrapper}>
            <Grid item className={classes.SubHeader}>Selected Operators</Grid>
            {Object.values(operatorStore.selectedOperators).map((operator: IOperator, index: number) => {
              return (
                  <Grid key={index} container item xs={12} className={classes.Row}>
                    <Grid item>
                      <OperatorDetails operator={operator} />
                    </Grid>
                    <Grid item xs>
                      <SsvAndSubTitle
                          ssv={formatNumberToUi(propertyCostByPeriod(walletStore.fromWei(operator.fee), validatorStore.fundingPeriod))}
                          subText={`/${formatNumberToUi(validatorStore.fundingPeriod, true)} days`}
                      />
                    </Grid>
                  </Grid>
              );
            })}
          </Grid>
        </Grid>,
        <FundingSummary />,
        <Grid container>
          <Grid item xs>
            <NameAndAddress name={'Total'} />
          </Grid>
          <Grid item style={{ marginBottom: 20 }}>
            <SsvAndSubTitle ssv={totalAmountOfSsv} bold />
          </Grid>
          {Number(totalAmountOfSsv) > ssvStore.walletSsvBalance && (
              <Grid container item className={classes.InsufficientBalanceWrapper}>
                <Grid item xs>
                  Insufficient SSV balance. There is not enough SSV in your wallet.
                </Grid>
                <Grid item>
                  <LinkText text={'Need SSV?'} link={'https://faucet.ssv.network'} />
                </Grid>
              </Grid>
          )}

          {errorMessage && <ErrorMessage text={errorMessage} />}

          <Grid container>
            <Button
                withAllowance
                text={actionButtonText}
                testId={'confirm-button'}
                onClick={onRegisterValidatorClick}
                disable={Number(totalAmountOfSsv) > ssvStore.walletSsvBalance}
            />
            {/* <CTAButton */}
            {/*  // checkboxesText={[<span>I have read and agreed to the <a target="_blank" href={'www.google.com'}>terms and condition</a></span>]} */}
            {/*  // checkBoxesCallBack={[selectCheckBox]} */}
            {/*  withAllowance */}
            {/*  testId={'confirm-button'} */}
            {/*  disable={false} */}
            {/*  onClick={onRegisterValidatorClick} */}
            {/*  text={actionButtonText} */}
            {/* /> */}
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(ValidatorRegistrationConfirmation);
