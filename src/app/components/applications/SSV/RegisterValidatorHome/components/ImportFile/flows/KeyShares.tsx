import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStyles } from '../ImportFile.styles';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';
import OperatorData
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData';
import ValidatorList
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorList';
import ValidatorCounter
  from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/ValidatorList/ValidatorCounter';


type ValidationError = {
  id: number,
  errorMessage: string,
  subErrorMessage?: string,
};
const VALIDATORS_TEMPLATE = [{
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}, {
  publicKey: '0x1234123123',
  errorMessage: 'error',
  registered: false,
}];
// const VALIDATORS_TEMPLATE = [{
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }, {
//   publicKey: '0x1234123123',
//   errorMessage: '',
//   registered: false,
// }];
const KeyShareFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const location = useLocation();
  const removeButtons = useRef(null);
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const operatorStore: OperatorStore = stores.Operator;
  const [errorMessage, setErrorMessage] = useState('');
  const [processingFile, setProcessFile] = useState(false);
  const [validatorsCount, setValidatorsCount] = useState(VALIDATORS_TEMPLATE.length);
  const [validationError, setValidationError] = useState<ValidationError>({
    id: 0,
    errorMessage: '',
    subErrorMessage: '',
  });
  const keyShareFileIsJson = validatorStore.isJsonFile(validatorStore.keyShareFile);
  const slashingWarningNavigate = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.SLASHING_WARNING),
    false: () => navigate(config.routes.SSV.VALIDATOR.SLASHING_WARNING),
  };
  const unsafeMode = getLocalStorageFlagValue(DEVELOPER_FLAGS.UPLOAD_KEYSHARE_UNSAFE_MODE) && location.pathname === config.routes.SSV.MY_ACCOUNT.KEYSHARE_UPLOAD_UNSAFE;
  useEffect(() => {
    validatorStore.clearKeyShareFlowData();
  }, []);

  const fileHandler = (file: any) => {
    setProcessFile(true);
    validatorStore.setKeyShareFile(file, async () => {
      const response = unsafeMode ? await validatorStore.validateKeySharePayloadUnsafe() : await validatorStore.validateKeySharePayload();
      console.log(response);
      setValidationError(response);
      setProcessFile(false);
    });
  };

  const ownerNonceIssueCondition = VALIDATORS_TEMPLATE.every((validator: any) => validator.errorMessage);

  const removeFile = () => {
    setProcessFile(true);
    validatorStore.clearKeyShareFlowData();
    setValidationError({ id: 0, errorMessage: '' });
    validatorStore.keyShareFile = null;
    setProcessFile(false);

    try {
      // @ts-ignore
      inputRef.current.value = null;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const renderFileImage = () => {
    let fileClass: any = classes.FileImage;
    if (validationError.id !== 0) {
      fileClass += ` ${classes.Fail}`;
    } else if (keyShareFileIsJson) {
      fileClass += ` ${classes.Success}`;
    } else if (!keyShareFileIsJson && validatorStore.keyShareFile) {
      fileClass += ` ${classes.Fail}`;
    }
    return <Grid item className={fileClass}/>;
  };

  const renderFileText = () => {
    if (!validatorStore.keyShareFile) {
      return (
        <Grid item xs={12} className={classes.FileText}>
          Drag and drop files or <LinkText text={'browse'}/>
        </Grid>
      );
    }

    if (!keyShareFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          Keyshares file must be in a JSON format.
          <RemoveButton/>
        </Grid>
      );
    }

    if (validationError.id !== 0) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          {validationError.errorMessage}
          {validationError.subErrorMessage && <Grid item>{validationError.subErrorMessage}</Grid>}
          <RemoveButton/>
        </Grid>
      );
    }

    if (keyShareFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
          {validatorStore.keyShareFile.name}
          <RemoveButton/>
        </Grid>
      );
    }
  };

  const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

  const submitHandler = async () => {
    if (unsafeMode) {
      return submitHandlerUnsafeMode();
    }
    try {
      applicationStore.setIsLoading(true);
      validatorStore.registrationMode = 0;
      slashingWarningNavigate[`${processStore.secondRegistration}`]();
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

  const submitHandlerUnsafeMode = async () => {
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
      console.log('catch');
      GoogleTagManager.getInstance().sendEvent({
        category: 'validator_register',
        action: 'upload_file',
        label: 'invalid_file',
      });
      setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
    }
    applicationStore.setIsLoading(false);
  };

  const buttonDisableConditions = processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist;

  const MainScreen = <BorderScreen
    blackHeader
    withoutNavigation={!unsafeMode && processStore.secondRegistration}
    header={translations.VALIDATOR.IMPORT.KEY_SHARES_TITLE}
    wrapperClass={classes.marginNone}
    body={[
      <Grid item container>
        <Grid item xs={12} className={classes.SubHeader}>Upload the generated <b>keyshares.json</b> file below</Grid>
        <ImportInput removeButtons={removeButtons} processingFile={processingFile} fileText={renderFileText}
                     fileHandler={fileHandler} fileImage={renderFileImage}/>
        <Grid className={classes.SummaryWrapper}>
          <Typography className={classes.KeysharesSummaryTitle}>Keyshares summary</Typography>
          <Grid className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Validators</Typography>
            <Typography className={classes.SummaryText}>100</Typography>
          </Grid>
          <Grid
            className={classes.SummaryInfoFieldWrapper}>
            <Typography className={classes.SummaryText}>Operators</Typography>
            <Grid className={classes.OperatorsWrapper}>
              {Object.values(operatorStore.selectedOperators).map((operator: IOperator) => <OperatorData
                operatorLogo={operator.logo} operatorId={operator.id}/>)}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>
        </Grid>
      </Grid>,
    ]}
  />;

  const SecondScreen = <BorderScreen
    withoutNavigation
    blackHeader
    header={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS}
    wrapperClass={classes.marginTop}
    sideElement={<ValidatorCounter maxCount={ownerNonceIssueCondition ? 0 : VALIDATORS_TEMPLATE.length} countOfValidators={ownerNonceIssueCondition ? 0 : validatorsCount}
                                   changeValidatorsCount={setValidatorsCount}/>}
    tooltipText={translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS_TOOLTIP} body={[
    <Grid item container>
      {ownerNonceIssueCondition && <ErrorMessage
        text={<Typography className={classes.ErrorMessageText}>Validators within this file have an incorrect <LinkText
          textSize={14} link={config.links.INCORRECT_OWNER_NONCE_LINK}
          text={'registration nonce'}/>.<br/> Please split the
          validator keys to new key shares aligned with the correct one.</Typography>}/>}
      <ValidatorList validatorsList={VALIDATORS_TEMPLATE} countOfValidators={validatorsCount}/>
      <Grid container item xs={12}>
        <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>
      </Grid>
    </Grid>,
  ]}
  />;

  if (!unsafeMode && processStore.secondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper
          type={0}
          header={'Cluster'}
        />
        {MainScreen}
      </Grid>
    );
  }

  return <Grid className={classes.KeysharesWrapper}>
    {MainScreen}
    {SecondScreen}
  </Grid>;
};

export default observer(KeyShareFlow);
