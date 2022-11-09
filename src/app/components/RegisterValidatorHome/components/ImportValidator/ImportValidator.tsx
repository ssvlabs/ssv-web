import axios from 'axios';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import MessageDiv from '~app/components/common/MessageDiv';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator/ImportValidator.styles';

const ImportValidator = ({ reUpload }: { reUpload?: boolean }) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    // @ts-ignore
    const { public_key } = useParams();
    const inputRef = useRef(null);
    const removeButtons = useRef(null);
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;
    const [errorMessage, setErrorMessage] = useState('');

    const [keyStorePassword, setKeyStorePassword] = useState('');

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
        validatorStore.setKeyStore(uploadedFile);
    };

    const handlePassword = (e: any) => {
        const inputText = e.target.value;
        setKeyStorePassword(inputText);
        if (errorMessage !== '') {
            setErrorMessage('');
        }
    };

    const isDeposited = async (): Promise<boolean> => {
        try {
            const beaconChaValidatorUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${validatorStore.keyStorePublicKey}/deposits`;
            const response: any = (await axios.get(beaconChaValidatorUrl)).data;
            const conditionalDataExtraction = Array.isArray(response.data) ? response.data[0] : response.data;
            return conditionalDataExtraction?.valid_signature;
        } catch (e) {
            return true;
        }
    };

    const removeFile = () => {
        validatorStore.setKeyStore(null);
        try {
            // @ts-ignore
            inputRef.current.value = null;
        } catch (e: any) {
            console.log(e.message);
        }
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

    const RemoveButton = () => <Grid ref={removeButtons} onClick={removeFile} className={classes.Remove}>Remove</Grid>;

    const renderFileText = () => {
        if (!validatorStore.keyStoreFile) {
            return (
              <Grid item xs={12} className={classes.FileText}>
                Drag and drop files or <LinkText text={'browse'} />
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
        if (!validatorStore.isJsonFile) {
            return (
              <Grid item xs={12} className={`${classes.FileText} ${classes.ErrorText}`}>
                Invalid file format - only .json files are supported
                <RemoveButton />
              </Grid>
            );
        }
    };

    const submitHandler = async () => {
        applicationStore.setIsLoading(true);
        try {
            await validatorStore.extractKeyStoreData(keyStorePassword);
            const deposited = await isDeposited();
            if (reUpload) {
                history.push(`/dashboard/validator/${public_key}/confirm`);
            } else if (deposited) {
                operatorStore.unselectAllOperators();
                history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
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