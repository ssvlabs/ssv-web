import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import { addNumber, formatNumberToUi, multiplyNumber } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import MessageDiv from '~app/components/common/MessageDiv/MessageDiv';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/common/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { useStyles } from './ImportValidatorConfirmation.styles';

const ImportValidatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [errorMessage, setErrorMessage] = useState('');
    // const [checked, selectCheckBox] = useState(false);
    const [actionButtonText, setActionButtonText] = useState('Run validator');
    let totalAmountOfSsv;
    let yearlyNetworkFee = '0';
    let liquidationCollateral = '0';
    let totalOperatorsYearlyFee = '0';
    if (process.env.REACT_APP_NEW_STAGE) {
        yearlyNetworkFee = ssvStore.newGetFeeForYear(ssvStore.networkFee, 11);
        totalOperatorsYearlyFee = ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee);
        liquidationCollateral = multiplyNumber(addNumber(ssvStore.networkFee, operatorStore.getSelectedOperatorsFee), ssvStore.liquidationCollateral);
        totalAmountOfSsv = formatNumberToUi(addNumber(addNumber(totalOperatorsYearlyFee, yearlyNetworkFee), liquidationCollateral));
    }

    const onRegisterValidatorClick = async () => {
        applicationStore.setIsLoading(true);
        setErrorMessage('');
        setActionButtonText('Waiting for confirmation...');
        const selectedOperatorsKeys = Object.values(operatorStore.selectedOperators);
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < selectedOperatorsKeys.length; i += 1) {
            const operatorValidators = await operatorStore.getOperatorValidatorsCount(selectedOperatorsKeys[i].operator_id);
            if (!operatorStore.isOperatorRegistrable(operatorValidators)) {
                setErrorMessage(`Operator ${selectedOperatorsKeys[i].name} has reached it’s validator’s limit cap. Please choose a different operator.`);
                setActionButtonText('Run validator');
                applicationStore.setIsLoading(false);
                return;
            }
        }

        const response = await validatorStore.addNewValidator(false);
        if (response) {
            operatorStore.unselectAllOperators();
            applicationStore.showTransactionPendingPopUp(false);
            history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
        }
        else {
            applicationStore.showTransactionPendingPopUp(false);
            setActionButtonText('Run validator');
        }
    };

    const fields = [
        { key: 'Operators yearly fee', value: totalOperatorsYearlyFee },
        { key: 'Network yearly fee', value: formatNumberToUi(yearlyNetworkFee) },
        { key: 'Liquidation collateral', value: formatNumberToUi(liquidationCollateral) },
    ];

    const components = [
      <Grid container>
        <Grid item className={classes.SubHeader}>Validator Public Key</Grid>
        <ValidatorKeyInput withBeaconcha address={validatorStore.keyStorePublicKey} />
        <Grid container item xs={12} className={classes.RowWrapper}>
          <Grid item className={classes.SubHeader}>Selected Operators</Grid>
          {Object.values(operatorStore.selectedOperators).map((operator: IOperator, index: number) => {
                    return (
                      <Grid key={index} container item xs={12} className={classes.Row}>
                        <Grid item>
                          <OperatorDetails operator={operator} />
                        </Grid>
                        {process.env.REACT_APP_NEW_STAGE && (
                        <Grid item xs>
                          <SsvAndSubTitle
                            ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))}
                            subText={'/year'}
                          />
                        </Grid>
                        )}
                      </Grid>
                    );
                })}
        </Grid>
      </Grid>,
    ];
    if (process.env.REACT_APP_NEW_STAGE) {
        components.push(
          <Grid container>
            <Grid item xs={12} className={classes.SubHeader}>Transaction Summary</Grid>
            {fields.map((field) => {
                    return (
                      <Grid item container className={classes.Row} key={field.key}>
                        <Grid item>
                          <NameAndAddress name={field.key} />
                        </Grid>
                        <Grid item xs>
                          <SsvAndSubTitle ssv={field.value} />
                        </Grid>
                      </Grid>
                    );
                })}
          </Grid>,
        );
    }
    components.push(
      <Grid container>
        {process.env.REACT_APP_NEW_STAGE && (
        <Grid item xs>
          <NameAndAddress name={'Total'} />
        </Grid>
            )}
        {process.env.REACT_APP_NEW_STAGE && (
          <Grid item style={{ marginBottom: 20 }}>
            <SsvAndSubTitle ssv={totalAmountOfSsv} bold />
          </Grid>
        )}
        {process.env.REACT_APP_NEW_STAGE && Number(totalAmountOfSsv) > ssvStore.walletSsvBalance && (
        <Grid container item className={classes.InsufficientBalanceWrapper}>
          <Grid item xs>
            Insufficient SSV balance. There is not enough SSV in your wallet.
          </Grid>
          <Grid item>
            <LinkText text={'Need SSV?'} link={'https://discord.gg/5DZ7Sm9D4W'} />
          </Grid>
        </Grid>
        )}

        {errorMessage && <MessageDiv text={errorMessage} />}

        <Grid container>
          <Button
            withAllowance
            disable={false}
            text={actionButtonText}
            testId={'confirm-button'}
            onClick={onRegisterValidatorClick}
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
    );

    return (
      <BorderScreen
        blackHeader
        body={components}
        sectionClass={classes.Section}
        header={translations.VALIDATOR.CONFIRMATION.TITLE}
      />
    );
};

export default observer(ImportValidatorConfirmation);
