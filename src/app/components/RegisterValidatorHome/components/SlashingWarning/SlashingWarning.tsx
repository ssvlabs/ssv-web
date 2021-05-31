import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import BackNavigation from '~app/common/components/BackNavigation';
import ApplicationStore from '~app/common/stores/Application.store';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
  const validatorStore: ContractValidator = stores.ContractValidator;
  const applicationStore: ApplicationStore = stores.Application;
  const checkboxLabelStyle = { fontSize: '13px' };
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const [userAgreed, setUserAgreed] = useState(false);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    const buttonEnabled = validatorStore.validatorPrivateKey
      && validatorStore.validatorPrivateKeyFile
      && userAgreed;

    setNextButtonEnabled(!!buttonEnabled);
    return () => {
      setNextButtonEnabled(false);
    };
  }, [validatorStore.validatorPrivateKey, validatorStore.validatorPrivateKeyFile, userAgreed]);

  const goToConfirmation = () => {
    validatorStore.addNewValidator(true).then(() => {
      applicationStore.setIsLoading(false);
      history.push(config.routes.VALIDATOR.CONFIRMATION_PAGE);
    }).catch(() => {
      applicationStore.setIsLoading(false);
      history.push(config.routes.VALIDATOR.CONFIRMATION_PAGE);
    });
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.VALIDATOR.SELECT_OPERATORS} text={translations.VALIDATOR.SELECT_OPERATORS.TITLE} />
      <Header title={translations.VALIDATOR.SLASHING_WARNING.TITLE} subtitle={translations.VALIDATOR.SLASHING_WARNING.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>

          <ValidatorKeyInput validatorKey={validatorStore.validatorPublicKey} />

          <br />
          <br />

          <Typography variant="subtitle1" style={{ fontSize: 13 }}>
            Running a validator simultaneously to the SSV network will cause slashing to your validator.
            <br />
            <br />
            To avoid slashing, <b>shut down your existing validator setup</b> before importing your validator to run with our network.
          </Typography>

          <FormControlLabel
            control={(
              <Checkbox
                data-testid="slashing-data-warning-checkbox"
                checked={userAgreed}
                onChange={(event) => {
                  setUserAgreed(event.target.checked);
                }}
                color="primary"
              />
            )}
            label={(
              <Typography style={checkboxLabelStyle}>
                I understand that running my validator simultaneously in multiple setups will cause slashing to my validator.
              </Typography>
            )}
            style={{ marginTop: 150 }}
          />

          <Button
            data-testid="register-validator"
            disabled={!nextButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={goToConfirmation}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(SlashingWarning);
