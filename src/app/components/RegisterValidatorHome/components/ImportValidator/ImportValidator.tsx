import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ApiRequest from '~lib/utils/ApiRequest';
// import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import ValidatorStore from '~app/common/stores/Validator.store';
import PrimaryButton from '~app/common/components/PrimaryButton';
import ApplicationStore from '~app/common/stores/Application.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/ImportValidator/ImportValidator.styles';

const ImportValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const history = useHistory();
  // const { getUserFlow } = useUserFlow();
  const inputRef = useRef(null);
  const validatorStore: ValidatorStore = stores.Validator;
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    validatorStore.setPassword('');
  }, []);

  useEffect(() => {
    if (validatorStore.validatorPrivateKeyFile) {
      // history.push(config.routes.VALIDATOR.DECRYPT);
    }
  }, [validatorStore.validatorPrivateKeyFile]);

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

  const submitHandler = () => {
    // hideMessage();
    const validatorSelectionPage = () => history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    validatorStore.extractPrivateKey().then(() => {
      const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${validatorStore.validatorPublicKey}/deposits`;
      return new ApiRequest({ url: beaconChaValidatorUrl, method: 'GET', errorCallback: validatorSelectionPage }).sendRequest().then((response: any) => {
        const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
        if (response.data !== null && conditionalDataExtraction?.valid_signature) {
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
        // showMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE, true);
      } else {
        // showMessage(error, true);
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
          Drag and drop files or <Grid className={classes.Browse} onClick={handleClick}>browse</Grid>
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
        header={translations.VALIDATOR.IMPORT.TITLE}
        link={{ to: config.routes.VALIDATOR.HOME, text: 'Back' }}
        body={[
          <Grid item container>
            <Grid item xs={12} className={classes.SubHeader}>{translations.VALIDATOR.IMPORT.DESCRIPTION}</Grid>
            <Grid container item xs={12} className={classes.DropZone} onDrop={handleDrop} onDragOver={handleDrag}>
              <input type="file" className={classes.Input} ref={inputRef} onChange={handleDrop} />
              {renderFileImage()}
              {renderFileText()}
            </Grid>
            <Grid container item xs={12}>
              <InputLabel title="Keystore Password" />
              <Grid item xs={12} className={classes.TextInput}>
                <TextInput withLock disable={!validatorStore.isJsonFile()} onChange={(event: any) => { validatorStore.setPassword(event.target.value); }} />
              </Grid>
              <PrimaryButton text={'Next'} onClick={submitHandler} disable={!validatorStore.isJsonFile() || !validatorStore.password} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(ImportValidator);
