import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import config, { translations } from '~app/common/config';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
// import CTAButton from '~app/common/components/CTAButton/CTAButton';
import PrimaryButton from '~app/common/components/PrimaryButton';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import MessageDiv from '~app/common/components/MessageDiv/MessageDiv';
import ValidatorKeyInput from '~app/common/components/AddressKeyInput';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import NameAndAddress from '~app/common/components/NameAndAddress/NameAndAddress';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import OperatorDetails from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';
import { useStyles } from './ImportValidatorConfirmation.styles';

const ImportValidatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const { redirectUrl, history } = useUserFlow();
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

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

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
            const operatorValidators = await operatorStore.getOperatorValidatorsCount(selectedOperatorsKeys[i].pubkey);
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
        <ValidatorKeyInput withBeaconcha address={validatorStore.validatorPublicKey} />
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
                            ssv={formatNumberToUi(ssvStore.getFeeForYear(operatorStore.operatorsFees[operator.pubkey].ssv))}
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
        <Grid item>
          <SsvAndSubTitle ssv={totalAmountOfSsv} bold subText={'~$757.5'} />
        </Grid>
            )}
        {process.env.REACT_APP_NEW_STAGE && (
        <Grid container item className={classes.InsufficientBalanceWrapper}>
          <Grid item xs>
            Insufficient SSV balance. There is not enough SSV in your wallet.
          </Grid>
          <Grid item>
            <a
              href="https://discord.gg/5DZ7Sm9D4W"
              target="_blank"
                        >
              Need SSV?
            </a>
          </Grid>
        </Grid>
        )}
        {errorMessage && <MessageDiv text={errorMessage} />}
        <Grid container>
          <PrimaryButton
            disable={false}
            dataTestId={'confirm-button'}
            text={actionButtonText}
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
        navigationLink={config.routes.VALIDATOR.SLASHING_WARNING}
      />
    );
};

export default observer(ImportValidatorConfirmation);
