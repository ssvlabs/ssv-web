import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
// import ApplicationStore from '~app/common/stores/Application.store';
import ValidatorStore from '~app/common/stores/Validator.store';
import CTAButton from '~app/common/components/CTAButton/CTAButton';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const actionButtonMargin = isMobile ? '76px' : '136px';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
    const { redirectUrl, history } = useUserFlow();
    const validatorStore: ValidatorStore = stores.Validator;
    const [userAgreed, setUserAgreed] = useState(false);
    const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

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
      history.push(config.routes.VALIDATOR.CONFIRMATION_PAGE);
  };

  return (
    <Screen
      navigationText={translations.VALIDATOR.ACCOUNT_BALANCE.TITLE}
      navigationLink={config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE}
      title={translations.VALIDATOR.SLASHING_WARNING.TITLE}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin, bodyMarginTop: '12px' }}
      subTitle={translations.VALIDATOR.SLASHING_WARNING.DESCRIPTION}
      body={(
        <Grid container wrap="nowrap" spacing={4} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <ValidatorKeyInput validatorKey={validatorStore.validatorPublicKey} />
          </Grid>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <Typography variant="subtitle1" className={classes.checkboxText}>
              Running a validator simultaneously to the SSV network will cause slashing to your validator.
            </Typography>
          </Grid>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <Typography variant="subtitle1" className={classes.checkboxText}>
              To avoid slashing, <b>shut down your existing validator setup</b> before importing your validator to
              run with our network.
            </Typography>
          </Grid>
        </Grid>
      )}
      actionButton={(
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <FormControlLabel
            style={{ marginBottom: '10px' }}
            control={(
              <Checkbox
                data-testid="slashing-data-warning-checkbox"
                checked={userAgreed}
                onChange={(event) => { setUserAgreed(event.target.checked); }}
                color="primary"
              />
            )}
            label={(
              <Typography className={classes.checkboxText}>
                I understand that running my validator simultaneously in multiple setups will cause slashing
                to my validator.
              </Typography>
            )}
          />
          <br />
          <br />
          <CTAButton
            testId={'register-validator'}
            disable={!nextButtonEnabled}
            onClick={goToConfirmation}
            text={'Next'}
          />
        </Grid>
      )}
    />
  );
};

export default observer(SlashingWarning);
