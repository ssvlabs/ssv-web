import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react';
import ApiRequest from '~lib/utils/ApiRequest';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
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
    const [keyStorePassword, setKeyStorePassword] = useState('');

    const handleClick = (e: any) => {
        if (e.target !== inputRef.current) {
            // @ts-ignore
            inputRef.current.click();
        }
    };

    const handleDrag = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (acceptedFiles: any) => {
        acceptedFiles.preventDefault();
        const uploadedFile = acceptedFiles.target?.files ?? acceptedFiles.dataTransfer?.files;
        if (uploadedFile.length > 0) fileHandler(uploadedFile);
    };

    const fileHandler = (files: any) => {
        const uploadedFile = files[0];
        validatorStore.setKeyStore(uploadedFile);
    };

    const handlePassword = (e: any) => {
        const inputText = e.target.value;
        setKeyStorePassword(inputText);
        if (errorMessage !== '') {
            setErrorMessage('');
        }
    };

    const validatorSelectionPage = () => history.push(config.routes.VALIDATOR.SELECT_OPERATORS);

    const isDeposited = async (): Promise<boolean> => {
        const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${validatorStore.keyStorePublicKey}/deposits`;
        const response: any = await new ApiRequest({
            url: beaconChaValidatorUrl,
            method: 'GET',
            errorCallback: validatorSelectionPage,
        }).sendRequest();
        const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
        return response.data !== null && conditionalDataExtraction?.valid_signature;
    };

    const removeFile = () => {
        validatorStore.setKeyStore(null);
    };

    const renderFileImage = () => {
        let fileClass: any = classes.FileImage;
        if (validatorStore.isJsonFile) {
            fileClass += ` ${classes.Success}`;
        }
        if (!validatorStore.isJsonFile && validatorStore.keyStoreFile) {
            fileClass += ` ${classes.Fail}`;
        }
        return <Grid item className={fileClass} />;
    };

    const renderFileText = () => {
        if (!validatorStore.keyStoreFile) {
            return (
              <Grid item xs={12} className={classes.FileText}>
                Drag and drop files or <Grid className={classes.Browse}>browse</Grid>
              </Grid>
            );
        }
        if (validatorStore.isJsonFile) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
                {validatorStore.keyStoreFile.name}
                <Grid onClick={removeFile} className={classes.Remove}>Remove</Grid>
              </Grid>
            );
        }
        if (!validatorStore.isJsonFile) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                Invalid file format - only .json files are supported
                <Grid onClick={removeFile} className={classes.Remove}>Remove</Grid>
              </Grid>
            );
        }
    };

    const submitHandler = async () => {
        applicationStore.setIsLoading(true);
        try {
            await validatorStore.extractKeyStoreData(keyStorePassword);
            const deposited = await isDeposited();
            if (deposited) {
                operatorStore.unselectAllOperators();
                validatorSelectionPage();
            } else {
                history.push(config.routes.VALIDATOR.DEPOSIT_VALIDATOR);
            }
        } catch (error: any) {
            if (error.message !== translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD) {
                setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
            } else {
                setErrorMessage(error.message);
            }
        }
        applicationStore.setIsLoading(false);
    };

    return (
      <BorderScreen
        blackHeader
        header={translations.VALIDATOR.IMPORT.TITLE}
        navigationLink={config.routes.VALIDATOR.HOME}
        body={[
          <Grid item container>
            <Grid item xs={12} className={classes.SubHeader}>{translations.VALIDATOR.IMPORT.DESCRIPTION}</Grid>
            <Grid
              container
              item xs={12}
              onDrop={handleDrop}
              onClick={handleClick}
              onDragOver={handleDrag}
              className={classes.DropZone}
            >
              <input type="file" className={classes.Input} ref={inputRef} onChange={handleDrop} />
              {renderFileImage()}
              {renderFileText()}
            </Grid>
            <Grid container item xs={12}>
              <InputLabel title="Keystore Password" />
              <Grid item xs={12} className={classes.ItemWrapper}>
                <TextInput withLock disable={!validatorStore.isJsonFile} value={keyStorePassword} onChangeCallback={handlePassword} />
              </Grid>
              <Grid item xs={12} className={classes.ErrorWrapper}>
                {errorMessage && <MessageDiv text={errorMessage} />}
              </Grid>
              <PrimaryButton text={'Next'} submitFunction={submitHandler}
                disable={!validatorStore.isJsonFile || !keyStorePassword || !!errorMessage} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(ImportValidator);