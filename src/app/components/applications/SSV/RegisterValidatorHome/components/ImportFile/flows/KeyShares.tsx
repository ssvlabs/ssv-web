import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStyles } from '../ImportFile.styles';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';

type ValidationError = {
  id: number,
  errorMessage: string,
  subErrorMessage?: string,
};

const KeyShareFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const removeButtons = useRef(null);
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');
  const [processingFile, setProcessFile] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError>({ id: 0, errorMessage: '', subErrorMessage: '' });
  const keyShareFileIsJson = validatorStore.isJsonFile(validatorStore.keyShareFile);
  const slashingWarningNavigate = {
    true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.SLASHING_WARNING),
    false: () => navigate(config.routes.SSV.VALIDATOR.SLASHING_WARNING),
  };

  useEffect(() => {
    validatorStore.clearKeyShareFlowData();
  }, []);

  const fileHandler = (file: any) => {
    setProcessFile(true);
    validatorStore.setKeyShareFile(file, async () => {
      const response = await validatorStore.validateKeySharePayload();
      console.log(response);
      setValidationError(response);
      setProcessFile(false);
    });
  };

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

  const buttonDisableConditions = processingFile || validationError.id !== 0 || !keyShareFileIsJson || !!errorMessage || validatorStore.validatorPublicKeyExist;

  const MainScreen = <BorderScreen
      blackHeader
      withoutNavigation={processStore.secondRegistration}
      header={translations.VALIDATOR.IMPORT.KEY_SHARES_TITLE}
      body={[
        <Grid item container>
          <Grid item xs={12} className={classes.SubHeader}>Upload the generated <b>keyshares.json</b> file below</Grid>
          <ImportInput removeButtons={removeButtons} processingFile={processingFile} fileText={renderFileText} fileHandler={fileHandler} fileImage={renderFileImage}/>
          <Grid container item xs={12}>
            <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions}/>
          </Grid>
        </Grid>,
      ]}
  />;

  if (processStore.secondRegistration) {
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

  return MainScreen;
};

export default observer(KeyShareFlow);
