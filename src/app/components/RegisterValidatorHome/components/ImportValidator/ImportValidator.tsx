import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useRef, useState } from 'react';
import ApiRequest from '~lib/utils/ApiRequest';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import PrimaryButton from '~app/common/components/PrimaryButton';
import MessageDiv from '~app/common/components/MessageDiv/MessageDiv';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/ImportValidator/ImportValidator.styles';

const ImportValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const { history } = useUserFlow();
  const inputRef = useRef(null);
  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    validatorStore.setPassword('');
  }, []);

  const handleClick = () => {
    // @ts-ignore
    inputRef.current.click();
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const event = e as Event;
    // @ts-ignore
    if (event.target.files) {
      // @ts-ignore
      fileHandler(event.target.files);
    } else {
      // @ts-ignore
      const files = event.dataTransfer.files;
      fileHandler(files);
    }
  };

  const fileHandler = (files: any) => {
    if (files.length === 1) {
      const uploadedFile = files[0];
      validatorStore.setValidatorPrivateKeyFile(uploadedFile);
    }
  };

  const inputHandler = (e: any) => {
    setErrorMessage('');
    validatorStore.setPassword(e.target.value);
  };

  const submitHandler = () => {
    applicationStore.setIsLoading(true);
    const validatorSelectionPage = () => history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    validatorStore.extractPrivateKey().then(() => {
      const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${validatorStore.validatorPublicKey}/deposits`;
      return new ApiRequest({ url: beaconChaValidatorUrl, method: 'GET', errorCallback: validatorSelectionPage }).sendRequest().then((response: any) => {
        const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
        if (response.data !== null && conditionalDataExtraction?.valid_signature) {
          operatorStore.unselectAllOperators();
          validatorSelectionPage();
        } else {
          history.push(config.routes.VALIDATOR.DEPOSIT_VALIDATOR);
        }
        applicationStore.setIsLoading(false);
      });
    }).catch((error: string) => {
      console.log(error);
      applicationStore.setIsLoading(false);
      if (error !== translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD) {
        setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
      } else {
        setErrorMessage(error);
      }
    });
  };

  const removeFile = () => {
    validatorStore.setValidatorPrivateKeyFile(null);
  };

  const renderFileImage = () => {
    let fileClass: any = classes.FileImage;
    if (validatorStore.isJsonFile()) {
      fileClass += ` ${classes.Success}`;
    }
    if (!validatorStore.isJsonFile() && validatorStore.validatorPrivateKeyFile) {
      fileClass += ` ${classes.Fail}`;
    }
    return <Grid item className={fileClass} />;
  };

  const renderFileText = () => {
    if (!validatorStore.validatorPrivateKeyFile) {
      return (
        <Grid item xs={12} className={classes.FileText}>
          Drag and drop files or <Grid className={classes.Browse}>browse</Grid>
        </Grid>
      );
    }
    if (validatorStore.isJsonFile()) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
          {validatorStore.validatorPrivateKeyFile.name}
          <Grid onClick={removeFile} className={classes.Remove}>Remove</Grid>
        </Grid>
      );
    }
    if (!validatorStore.isJsonFile()) {
      return (
        <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
          Invalid file format - only .json files are supported
          <Grid onClick={removeFile} className={classes.Remove}>Remove</Grid>
        </Grid>
      );
    }
  };

    return (
      <BorderScreen
        blackHeader
        header={translations.VALIDATOR.IMPORT.TITLE}
        navigationLink={config.routes.VALIDATOR.HOME}
        body={[
          <Grid item container>
            <Grid item xs={12} className={classes.SubHeader}>{translations.VALIDATOR.IMPORT.DESCRIPTION}</Grid>
            <Grid container item xs={12} className={classes.DropZone} onDrop={handleDrop} onDragOver={handleDrag} onClick={handleClick}>
              <input type="file" className={classes.Input} ref={inputRef} onChange={handleDrop} />
              {renderFileImage()}
              {renderFileText()}
            </Grid>
            <Grid container item xs={12}>
              <InputLabel title="Keystore Password" />
              <Grid item xs={12} className={classes.ItemWrapper}>
                <TextInput withLock disable={!validatorStore.isJsonFile()} onChange={inputHandler} />
              </Grid>
              <Grid item xs={12} className={classes.ErrorWrapper}>
                {errorMessage && <MessageDiv text={translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD} />}
              </Grid>
              <PrimaryButton text={'Next'} onClick={submitHandler} disable={!validatorStore.isJsonFile() || !validatorStore.password || !!errorMessage} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(ImportValidator);
