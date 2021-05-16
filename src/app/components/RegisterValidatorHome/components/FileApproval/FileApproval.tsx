import React, { useEffect } from 'react';
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
  const registerButtonStyle = { width: '100%', marginTop: 180 };
  const { redirectUrl, history } = useUserFlow();
  const classes = useStyles();
  const stores = useStores();
  const validatorStore: ContractValidator = stores.ContractValidator;

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const goToSelectOperators = async () => {
    const privateKey = await validatorStore.extractPrivateKey();
    if (privateKey) {
      history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    }
  };

  const removeKeyStoreFile = () => {
    validatorStore.setValidatorPrivateKeyFile(false);
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.OPERATOR.HOME} text="Join SSV Network" />
      <Header title={translations.VALIDATOR.IMPORT.TITLE} subtitle={translations.VALIDATOR.IMPORT.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <InputLabel title="Keystore File">
            <Grid container className={classes.fileContainer}>
              <Grid item xs={1}>
                <DoneIcon className={classes.doneIcon} />
              </Grid>
              <Grid className={classes.fileNameText} item xs={8}>
                {validatorStore.validatorPrivateKeyFile && validatorStore.validatorPrivateKeyFile.name}
              </Grid>
              <Grid item xs={3}>
                <ClearIcon onClick={removeKeyStoreFile} className={classes.clearIcon} />
              </Grid>
            </Grid>
          </InputLabel>
          <br />
          <InputLabel title="Keystore Password">
            <TextInput
              type="text"
              value={validatorStore.validatorKeyStorePassword}
              onChange={(event: any) => validatorStore.setValidatorKeyStorePassword(event.target.value)}
            />
          </InputLabel>

          <Button
            disabled={!validatorStore.validatorKeyStorePassword}
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
