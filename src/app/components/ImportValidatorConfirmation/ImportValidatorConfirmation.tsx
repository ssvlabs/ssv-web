import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import config, { translations } from '~app/common/config';
import ValidatorStore from '~app/common/stores/Validator.store';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import SsvAndSubTitle from '~app/common/components/SsvAndSubTitle';
import ApplicationStore from '~app/common/stores/Application.store';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import OperatorStore, { IOperator } from '~app/common/stores/Operator.store';
import NameAndAddress from '~app/common/components/NameAndAddress/NameAndAddress';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp';
import { useStyles } from './ImportValidatorConfirmation.styles';

const ImportValidatorConfirmation = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const { redirectUrl, history } = useUserFlow();
    const [txHash, setTxHash] = useState('');
    const [checked, selectCheckBox] = useState(false);
    const [actionButtonText, setActionButtonText] = useState('Run validator');
    let totalOperatorsYearlyFee = 0;
    let yearlyNetworkFee = 0;
    let liquidationCollateral = 0;
    let totalAmountOfSsv;
    if (process.env.NEW_STAGE) {
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
        setActionButtonText('Waiting for confirmation...');
        return validatorStore.addNewValidator(false, handlePendingTransaction).then(() => {
            applicationStore.showTransactionPendingPopUp(false);
            history.push(config.routes.VALIDATOR.SUCCESS_PAGE);
        }).catch(() => {
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
        <ValidatorKeyInput withBeaconcha validatorKey={validatorStore.validatorPublicKey} />
        <Grid container item xs={12} className={classes.RowWrapper}>
          <Grid item className={classes.SubHeader}>Selected Public Key</Grid>
          {Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
                    return (
                      <Grid container item xs={12} className={classes.Row}>
                        <Grid item>
                          <NameAndAddress
                            name={operator.name}
                            address={`0x${longStringShorten(sha256(walletStore.decodeKey(operator.pubkey)), 4)}`}
                                />
                        </Grid>
                        {process.env.NEW_STAGE && (
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
    if (process.env.NEW_STAGE) {
        components.push(
          <Grid container>
            <Grid item xs={12} className={classes.SubHeader}>Transaction Summary</Grid>
            {fields.map((field) => {
                    return (
                      <Grid item container className={classes.Row}>
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
        {process.env.NEW_STAGE && (
        <Grid item xs>
          <NameAndAddress name={'Total'} />
        </Grid>
            )}
        {process.env.NEW_STAGE && (
        <Grid item>
          <SsvAndSubTitle ssv={totalAmountOfSsv} bold subText={'~$757.5'} />
        </Grid>
            )}
        {process.env.NEW_STAGE && (
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
        <Grid container>
          <CTAButton
            checkboxesText={[<span>I have read and agreed to the <a target="_blank" href={'www.google.com'}>terms and condition</a></span>]}
            checkBoxesCallBack={[selectCheckBox]}
            withAllowance
            testId={'confirm-button'}
            disable={!checked}
            onClick={onRegisterValidatorClick}
            text={actionButtonText}
          />
        </Grid>
      </Grid>,
    );

    return (
      <BorderScreen
        sectionClass={classes.Section}
        withConversion
        header={translations.VALIDATOR.CONFIRMATION.TITLE}
        link={{ to: config.routes.VALIDATOR.SLASHING_WARNING, text: 'Back' }}
        body={components}
      />
    );
};

export default observer(ImportValidatorConfirmation);
