import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENV } from '~lib/utils/envHelper';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/ImportFile.styles';
import validatorRegistrationFlow, { EValidatorFlowAction } from '~app/hooks/useValidatorRegistrationFlow';
import ImportInput from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/common';

const KeyStoreFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);
  const inputRef = useRef(null);
  const removeButtons = useRef(null);
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [keyStorePassword, setKeyStorePassword] = useState('');
  const keyStoreFileIsJson = validatorStore.isJsonFile(validatorStore.keyStoreFile);

  useEffect(() => {
    validatorStore.clearKeyStoreFlowData();
  }, []);

  const fileHandler = (file: any) => {
    setIsProcessingFile(true);
    validatorStore.setKeyStore(file, () => {
      setIsProcessingFile(false);
    });
  };

  const handlePassword = (e: any) => {
    const inputText = e.target.value;
    setKeyStorePassword(inputText);
    if (errorMessage !== '') {
      setErrorMessage('');
    }
  };

  const isDeposited = async (): Promise<boolean> => {
    const beaconChaValidatorUrl = `${ENV().BEACONCHA_URL}/api/v1/validator/${validatorStore.keyStorePublicKey}/deposits`;
    try {
      const response: any = (await axios.get(beaconChaValidatorUrl, { timeout: 5000 })).data;
      const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
      return !(response.status === 'OK' && conditionalDataExtraction?.valid_signature === undefined);
    } catch (e: any) {
      console.log(e.message);
      return true;
    }
  };

  const removeFile = () => {
    setIsProcessingFile(true);
    validatorStore.clearKeyStoreFlowData();
    validatorStore.keyStoreFile = null;
    setIsProcessingFile(false);

    try {
      // @ts-ignore
      inputRef.current.value = null;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const renderFileImage = () => {
    let fileClass: any = classes.FileImage;
    if (validatorStore.validatorPublicKeyExist) {
      fileClass += ` ${classes.Fail}`;
    } else if (keyStoreFileIsJson) {
      fileClass += ` ${classes.Success}`;
    } else if (!keyStoreFileIsJson && validatorStore.keyStoreFile) {
      fileClass += ` ${classes.Fail}`;
    }
    return <Grid item className={fileClass}/>;
  };

  const renderFileText = () => {
    if (!validatorStore.keyStoreFile) {
      return (
        <Grid item xs={12} className={classes.FileText}>
          Drag and drop files or <LinkText text={'browse'}/>
        </Grid>
      );
    }

    if (keyStoreFileIsJson && validatorStore.validatorPublicKeyExist) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          Validator is already registered to the network, <br/>
          please try a different keystore file.
          <RemoveButton/>
        </Grid>
      );
    }
    if (!keyStoreFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          Invalid file format - only .json files are supported
          <RemoveButton/>
        </Grid>
      );
    }

    if (keyStoreFileIsJson) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
          {validatorStore.keyStoreFile.name}
          <RemoveButton/>
        </Grid>
      );
    }
  };

  const sendTagManagerEvent = (category: string, action: string, label: string) => {
    GoogleTagManager.getInstance().sendEvent({ category, action, label });
  };

  const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

  const submitHandler = async () => {
    applicationStore.setIsLoading(true);
    setTimeout(async () => {
      try {
        await validatorStore.extractKeyStoreData(keyStorePassword);
        // TODO fix this dummy value.
        const deposited = true; // await isDeposited()
        const nextRouteAction = processStore.secondRegistration ? EValidatorFlowAction.SECOND_REGISTER : EValidatorFlowAction.FIRST_REGISTER;
        applicationStore.setIsLoading(false);
        validatorStore.registrationMode = 1;
        validatorStore.setMultiSharesMode(1);
        navigate(getNextNavigation(nextRouteAction));
        if (deposited) {
          sendTagManagerEvent('validator_register', 'upload_file', 'success');
        } else {
          sendTagManagerEvent('validator_register', 'upload_file', 'not_deposited');
          navigate(config.routes.SSV.VALIDATOR.DEPOSIT_VALIDATOR);
        }
      } catch (error: any) {
        if (error.message === 'Invalid password') {
          sendTagManagerEvent('validator_register', 'upload_file', 'invalid_password');
          setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD);
        } else {
          sendTagManagerEvent('validator_register', 'upload_file', 'invalid_file');
          setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
        }
        applicationStore.setIsLoading(false);
      }
    }, 200);
  };


  const inputDisableConditions = !keyStoreFileIsJson || isProcessingFile || validatorStore.validatorPublicKeyExist;
  const buttonDisableConditions = isProcessingFile || !keyStoreFileIsJson || !keyStorePassword || !!errorMessage || validatorStore.validatorPublicKeyExist;

  const MainScreen = <BorderScreen
    blackHeader
    header={translations.VALIDATOR.IMPORT.TITLE}
    withoutNavigation={processStore.secondRegistration}
    body={[
      <Grid item container>
        <Grid item xs={12} className={classes.SubHeader}>Upload your validator <b>keystore</b> file below</Grid>
        <ImportInput
          fileText={renderFileText}
          fileHandler={fileHandler}
          fileImage={renderFileImage}
          removeButtons={removeButtons}
          processingFile={isProcessingFile}
        />
        <Grid container item xs={12}>
          <><InputLabel title="Keystore Password"/>
            <Grid item xs={12} className={classes.ItemWrapper}>
              <TextInput withLock disable={inputDisableConditions} value={keyStorePassword}
                         onChangeCallback={handlePassword}/>
            </Grid>
            <Grid item xs={12} className={classes.ErrorWrapper}>
              {errorMessage && <ErrorMessage text={errorMessage}/>}
            </Grid></>
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

export default observer(KeyStoreFlow);
