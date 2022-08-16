 import axios from 'axios';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/components/common/Spinner';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import BorderScreen from '~app/components/common/BorderScreen';
import MessageDiv from '~app/components/common/MessageDiv/MessageDiv';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import EventStore from '~app/common/stores/applications/SsvWeb/Event.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator/ImportValidator.styles';

const ImportValidator = ({ reUpload }: { reUpload?: boolean }) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const inputRef = useRef(null);
    const removeButtons = useRef(null);
    const eventStore: EventStore = stores.Event;
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [validatorPublicKey, setValidatorPublicKey] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [processingFile, setProcessFile] = useState(false);
    const [keyStorePassword, setKeyStorePassword] = useState('');

    useEffect(() => {
        if (reUpload) {
            if (!validatorStore.processValidatorPublicKey) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
            Validator.getInstance().getValidator(validatorStore.processValidatorPublicKey).then((validator: any) => {
                setValidatorPublicKey(validator.public_key);
            });
            validatorStore.keyStoreFile = null;
        }
        validatorStore.clearValidatorData();
    }, []);

    const handleClick = (e: any) => {
        if (e.target !== inputRef.current && e.target !== removeButtons?.current) {
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
        setProcessFile(true);
        validatorStore.setKeyStore(uploadedFile, () => { setProcessFile(false); });
    };

    const handlePassword = (e: any) => {
        const inputText = e.target.value;
        setKeyStorePassword(inputText);
        if (errorMessage !== '') {
            setErrorMessage('');
        }
    };

    const isDeposited = async (): Promise<boolean> => {
        const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${validatorStore.keyStorePublicKey}/deposits`;
        try {
            const response: any = (await axios.get(beaconChaValidatorUrl, { timeout: 5000 })).data;
            const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
            return conditionalDataExtraction?.valid_signature;
        } catch (e: any) {
            console.log(e.message);
            return true;
        }
    };

    const removeFile = () => {
        setProcessFile(true);
        validatorStore.clearValidatorData();
        validatorStore.keyStoreFile = null;
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
        const keyStorePublicKey = validatorStore.keyStorePublicKey;
        if (
            reUpload &&
            validatorStore.isJsonFile &&
            keyStorePublicKey?.toLowerCase() !== validatorPublicKey.replace('0x', '')?.toLowerCase()
        ) {
            fileClass += ` ${classes.Fail}`;
        } else if (!reUpload && validatorStore.validatorPublicKeyExist) {
            fileClass += ` ${classes.Fail}`;
        }
        else if (validatorStore.isJsonFile) {
            fileClass += ` ${classes.Success}`;
        } else if (!validatorStore.isJsonFile && validatorStore.keyStoreFile) {
            fileClass += ` ${classes.Fail}`;
        }
        return <Grid item className={fileClass} />;
    };
    
    const renderFileText = () => {
        if (!validatorStore.keyStoreFile) {
            return (
              <Grid item xs={12} className={classes.FileText}>
                Drag and drop files or <LinkText text={'browse'} />
              </Grid>
            );
        }
        const keyStorePublicKey = validatorStore.keyStorePublicKey;

        if (
            reUpload &&
            keyStorePublicKey?.toLowerCase() !== validatorPublicKey.replace('0x', '')?.toLowerCase()
        ) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                This keystore is not associated with this validator
                <RemoveButton />
              </Grid>
            );
        }
        if (!reUpload && validatorStore.isJsonFile && validatorStore.validatorPublicKeyExist) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                Validator is already registered to the network, <br />
                please try a different keystore file.
                <RemoveButton />
              </Grid>
            );
        }
        if (!validatorStore.isJsonFile) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                Invalid file format - only .json files are supported
                <RemoveButton />
              </Grid>
            );
        }

        if (validatorStore.isJsonFile) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.SuccessText}`}>
                {validatorStore.keyStoreFile.name}
                <RemoveButton />
              </Grid>
            );
        }
    };

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

    const submitHandler = async () => {
        applicationStore.setIsLoading(true);
        try {
            await validatorStore.extractKeyStoreData(keyStorePassword);
            const deposited = await isDeposited();
            if (reUpload) {
                history.push(config.routes.SSV.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CONFIRM_TRANSACTION);
            } else if (deposited) {
                operatorStore.unselectAllOperators();
                eventStore.send({ category: 'validator_register', action: 'upload_file', label: 'success' });
                history.push(config.routes.SSV.VALIDATOR.SELECT_OPERATORS);
            } else {
                eventStore.send({ category: 'validator_register', action: 'upload_file', label: 'error' });
                history.push(config.routes.SSV.VALIDATOR.DEPOSIT_VALIDATOR);
            }
        } catch (error: any) {
            eventStore.send({ category: 'validator_register', action: 'upload_file', label: 'error' });
            if (error.message === 'Invalid password') {
                setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD);
            } else {
                setErrorMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE);
            }
        }
        applicationStore.setIsLoading(false);
    };

    const buttonDisableConditions = !validatorStore.isJsonFile
        || !keyStorePassword
        || !!errorMessage
        || (reUpload && validatorStore.keyStorePublicKey?.toLowerCase() !== validatorPublicKey?.replace('0x', '')?.toLowerCase())
        || (!reUpload && validatorStore.validatorPublicKeyExist);

    const inputDisableConditions = !validatorStore.isJsonFile
        || processingFile
        || (!reUpload && validatorStore.validatorPublicKeyExist)
        || (reUpload && validatorStore.keyStorePublicKey?.toLowerCase() !== validatorPublicKey?.replace('0x', '')?.toLowerCase());

    return (
      <BorderScreen
        blackHeader
        wrapperClass={classes.Wrapper}
        header={translations.VALIDATOR.IMPORT.TITLE}
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
              {!processingFile && renderFileImage()}
              {!processingFile && renderFileText()}
              {processingFile && (
                <Grid container item>
                  <Grid item style={{ margin: 'auto' }}>
                    <Spinner />
                  </Grid>
                </Grid>
                )}

            </Grid>
            <Grid container item xs={12}>
              <InputLabel title="Keystore Password" />
              <Grid item xs={12} className={classes.ItemWrapper}>
                <TextInput withLock disable={inputDisableConditions} value={keyStorePassword} onChangeCallback={handlePassword} />
              </Grid>
              <Grid item xs={12} className={classes.ErrorWrapper}>
                {errorMessage && <MessageDiv text={errorMessage} />}
              </Grid>
              <PrimaryButton text={'Next'} submitFunction={submitHandler} disable={buttonDisableConditions} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(ImportValidator);