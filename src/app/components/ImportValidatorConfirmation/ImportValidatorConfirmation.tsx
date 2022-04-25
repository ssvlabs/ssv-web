import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/common/components/LinkText';
import config, { translations } from '~app/common/config';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import MessageDiv from '~app/common/components/MessageDiv/MessageDiv';
import ValidatorKeyInput from '~app/common/components/AddressKeyInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
import NameAndAddress from '~app/common/components/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { useStyles } from './ImportValidatorConfirmation.styles';

const ImportValidatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [txHash, setTxHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const [checked, selectCheckBox] = useState(false);
    const [actionButtonText, setActionButtonText] = useState('Run validator');
    let totalOperatorsYearlyFee = 0;
    let yearlyNetworkFee = 0;
    let liquidationCollateral = 0;
    let totalAmountOfSsv;
    if (process.env.REACT_APP_NEW_STAGE) {
         totalOperatorsYearlyFee = ssvStore.getFeeForYear(operatorStore.getSelectedOperatorsFee);
         yearlyNetworkFee = ssvStore.getFeeForYear(ssvStore.networkFee);
         liquidationCollateral = (ssvStore.networkFee + operatorStore.getSelectedOperatorsFee) * ssvStore.liquidationCollateral;
         totalAmountOfSsv = formatNumberToUi(totalOperatorsYearlyFee + yearlyNetworkFee + liquidationCollateral);
    }

    const handlePendingTransaction = (transactionHash: string) => {
        setTxHash(transactionHash);
        applicationStore.showTransactionPendingPopUp(true);
    };

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

        return validatorStore.addNewValidator(false, handlePendingTransaction).then(() => {
            applicationStore.setIsLoading(false);
            operatorStore.unselectAllOperators();
            applicationStore.showTransactionPendingPopUp(false);
            history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
        }).catch(() => {
            applicationStore.setIsLoading(false);
            applicationStore.showTransactionPendingPopUp(false);
            setActionButtonText('Run validator');
        });
    };

    const fields = [
        { key: 'Operators yearly fee', value: formatNumberToUi(totalOperatorsYearlyFee) },
        { key: 'Network yearly fee', value: formatNumberToUi(yearlyNetworkFee) },
        { key: 'Liquidation collateral', value: formatNumberToUi(liquidationCollateral) },
    ];

    const components = [
      <Grid container>
        <TransactionPendingPopUp txHash={txHash} />
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
                            ssv={formatNumberToUi(operator.fee)}
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
            <SsvAndSubTitle ssv={totalAmountOfSsv} bold subText={'~$757.5'} />
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
          <PrimaryButton
            disable={false}
            dataTestId={'confirm-button'}
            text={actionButtonText}
            submitFunction={onRegisterValidatorClick}
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
