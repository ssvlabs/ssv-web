import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import ErrorMessage from '~app/components/common/ErrorMessage';
import BorderScreen from '~app/components/common/BorderScreen';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import NameAndAddress from '~app/components/common/NameAndAddress/NameAndAddress';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import {
    useStyles,
} from '~app/components/applications/SSV/ValidatorRegistrationConfirmation/ValidatorRegistrationConfirmation.styles';
import OperatorDetails
    from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails/OperatorDetails';

const ValidatorRegistrationConfirmationUnsafe = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const ssvStore: SsvStore = stores.SSV;
    const operatorStore: OperatorStore = stores.Operator;
    const { checkedCondition } = useTermsAndConditions();
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [errorMessage, setErrorMessage] = useState('');
    const [actionButtonText] = useState('Register Validator');
    const totalAmountOfSsv = 4.5;

    const onRegisterValidatorClick = async () => {
        try {
          const response = await validatorStore.addNewValidatorUnsafe();
          if (response) {
            applicationStore.showTransactionPendingPopUp(false);
            navigate(config.routes.SSV.VALIDATOR.SUCCESS_PAGE);
          } else {
            applicationStore.showTransactionPendingPopUp(false);
          }
          applicationStore.setIsLoading(false);
        } catch (error: any) {
          GoogleTagManager.getInstance().sendEvent({
            category: 'validator_register',
            action: 'upload_file',
            label: 'invalid_file',
          });
          setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
        }
        applicationStore.setIsLoading(false);
    };

    const TotalSection = <Grid container>
        <Grid item xs>
            <NameAndAddress name={'Total'}/>
        </Grid>
        <Grid item style={{ marginBottom: 20 }}>
            <Grid className={classes.TotalSSV}>{4.5} SSV</Grid>
        </Grid>
        {Number(totalAmountOfSsv) > ssvStore.walletSsvBalance && (
            <Grid container item className={classes.InsufficientBalanceWrapper}>
                <Grid item xs>
                    Insufficient SSV balance. There is not enough SSV in your wallet.
                </Grid>
                <Grid item>
                    <LinkText text={'Need SSV?'} link={'https://faucet.ssv.network'}/>
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
                    disable={Number(totalAmountOfSsv) > ssvStore.walletSsvBalance || !checkedCondition}
                    totalAmount={totalAmountOfSsv.toString()}
                />
            </TermsAndConditionsCheckbox>
        </Grid>
    </Grid>;

    const screenBody = [<Grid container>
        <Grid item className={classes.SubHeader}>Validator Public Key</Grid>
        <ValidatorKeyInput withBeaconcha address={validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey} />
        <Grid container item xs={12} className={classes.RowWrapper}>
            <Grid item className={classes.SubHeader}>Selected Operators</Grid>
            {Object.values(operatorStore.selectedOperators).map((operator: IOperator, index: number) =>
                    <Grid key={index} container item xs={12} className={classes.Row}>
                        <Grid item>
                            <OperatorDetails operator={operator}/>
                        </Grid>
                    </Grid>,
            )}
        </Grid>
    </Grid>,
    ];

    screenBody.push(TotalSection);

    const MainScreen = <BorderScreen
        blackHeader
        marginTop={32}
        sectionClass={classes.Section}
        header={translations.VALIDATOR.CONFIRMATION.TITLE}
        body={screenBody}
    />;

    return MainScreen;
};

export default observer(ValidatorRegistrationConfirmationUnsafe);
