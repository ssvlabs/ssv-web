import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import BackNavigation from '~app/common/components/BackNavigation';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';

const EnterValidatorPrivateKey = () => {
  const registerButtonStyle = { width: '100%', marginTop: 20 };
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
      if (error !== 'Invalid keystore file password') {
        showMessage('Invalid file type.', true);
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
    validatorStore.setValidatorPrivateKeyFile(false);
    history.push(config.routes.VALIDATOR.IMPORT);
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.VALIDATOR.HOME} text="Run Validator with the SSV Network" />
      <Header title={translations.VALIDATOR.IMPORT.TITLE} subtitle={translations.VALIDATOR.IMPORT.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <InputLabel title="Keystore File generated from CLI">
            <Grid container className={classes.fileContainer}>
              <Grid item xs={1}>
                {validatorStore.isJsonFile() ? <DoneIcon className={classes.doneIcon} /> : <ClearIcon className={classes.badFormat} />}
              </Grid>
              <Grid className={classes.fileNameText} item xs={8}>
                {validatorStore.validatorPrivateKeyFile?.name}
              </Grid>
              <Grid item xs={3}>
                <ClearIcon onClick={removeKeyStoreFile} className={classes.clearIcon} />
              </Grid>
            </Grid>
          </InputLabel>
          <br />
          <InputLabel title="Keystore Password">
            <TextInput
              data-testid="keystore-password"
              type="text"
              className={classes.passwordInput}
              value={validatorStore.password}
              onChange={(event: any) => validatorStore.setPassword(event.target.value)}
            />
          </InputLabel>
          <Grid className={classes.paddingTop} item xs={12}>
            {showErrorMessage && (
              <div className={classes.errorDiv}>
                {errorMessage}
              </div>
            )}
          </Grid>
          <Button
            data-testid="decrypt-keystore-button"
            disabled={!validatorStore.password.length || !validatorStore.isJsonFile()}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={goToSelectOperators}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(EnterValidatorPrivateKey);
