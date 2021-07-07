import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import ClearIcon from '@material-ui/icons/Clear';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import InputLabel from '~app/common/components/InputLabel';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const actionButtonMargin = isMobile ? '159px' : '189px';

const EnterValidatorPrivateKey = () => {
  const { redirectUrl, history } = useUserFlow();
  const classes = useStyles();
  const stores = useStores();
  const validatorStore: ContractValidator = stores.ContractValidator;
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    validatorStore.cleanPrivateData();
    if (!validatorStore.isJsonFile() && !showErrorMessage) showMessage('Invalid file format - only .json files are supported', true);
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl, validatorStore.isJsonFile]);

  const goToSelectOperators = async () => {
    hideMessage();
    validatorStore.extractPrivateKey().then(() => {
      history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    }).catch((error: string) => {
      if (error !== translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_PASSWORD) {
        showMessage(translations.VALIDATOR.IMPORT.FILE_ERRORS.INVALID_FILE, true);
      } else {
        showMessage(error, true);
      }
    });
  };

  const showMessage = (text: string, status: boolean): void => {
    setErrorMessage(text);
    setShowErrorMessage(status);
  };

  const hideMessage = (): void => {
    setErrorMessage('');
    setShowErrorMessage(false);
  };

  const removeKeyStoreFile = () => {
    validatorStore.clearValidatorData();
    validatorStore.setValidatorPrivateKeyFile(false);
    history.push(config.routes.VALIDATOR.IMPORT);
  };
  
  const serializeFileName = (fileName: string) => {
    if (fileName.length > 34 && isMobile) {
      return `${fileName.slice(0, 15)}...${fileName.slice(fileName.length - 15, fileName.length)}`;
    } 
    return fileName;
  };

  return (
    <Screen
      navigationText={'Run Validator with the SSV Network'}
      navigationLink={config.routes.VALIDATOR.HOME}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin }}
      title={translations.VALIDATOR.IMPORT.TITLE}
      subTitle={translations.VALIDATOR.IMPORT.DESCRIPTION}
      body={(
        <Grid container className={classes.gridContainer} spacing={2}>
          <Grid item>
            <InputLabel title="Keystore File" subTitle="generated from CLI">
              <Grid container className={classes.fileContainer}>
                <Grid item xs={2} lg={1}>
                  {validatorStore.isJsonFile() ? <img className={classes.approvedIcon} src={'/images/approved_file_icon.svg'} /> : <ClearIcon className={classes.badFormat} />}
                </Grid>
                <Grid className={classes.fileNameText} item xs={9} lg={10}>
                  {validatorStore.validatorPrivateKeyFile?.name && serializeFileName(validatorStore.validatorPrivateKeyFile.name)}
                </Grid>
                <Grid item xs={1} lg={1} onClick={removeKeyStoreFile} className={classes.removeIconWrapper}>
                  <img className={classes.clearIcon} src={'/images/remove_icon.svg'} />
                </Grid>
              </Grid>
            </InputLabel>
          </Grid>
          <Grid item>
            <InputLabel title="Keystore Password">
              <TextInput
                data-testid="keystore-password"
                type="text"
                className={classes.passwordInput}
                value={validatorStore.password}
                onChange={(event: any) => validatorStore.setPassword(event.target.value)}
                    />
            </InputLabel>
            <Grid item xs={12}>
              {showErrorMessage && (
                <div className={classes.errorDiv}>
                  {errorMessage}
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId={'decrypt-keystore-button'}
          disable={!validatorStore.password.length || !validatorStore.isJsonFile()}
          onClick={goToSelectOperators}
          text={'Next'}
        />
      )}
    />
  );
};

export default observer(EnterValidatorPrivateKey);
