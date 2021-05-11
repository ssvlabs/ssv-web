import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import SsvStore from '~app/common/stores/Ssv.store';
import Typography from '@material-ui/core/Typography';
import Backdrop from '~app/common/components/Backdrop';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import MessageDiv from '~app/common/components/MessageDiv';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Home/Home.styles';
import BackNavigation from '~app/common/components/BackNavigation';
import { validatePublicKeyInput, validateDisplayNameInput } from '~lib/utils/validatesInputs';

const GenerateOperatorKeys = () => {
  const classes = useStyles();
  const stores = useStores();
  const history = useHistory();
  const ssv: SsvStore = stores.ssv;
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const [inputsData, setInputsData] = useState({ publicKey: '', name: '' });
  const [displayNameError, setDisplayNameError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);

  // Inputs validation
  // TODO: add validation of proper formats
  useEffect(() => {
    const isRegisterButtonEnabled = ssv.addingNewOperator
        || !inputsData.name
        || !inputsData.publicKey
        || displayNameError.shouldDisplay
        || publicKeyError.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData, displayNameError.shouldDisplay, publicKeyError.shouldDisplay, inputsData.name, inputsData.publicKey]);

  const onInputChange = (name: string, value: string) => {
    setInputsData({ ...inputsData, [name]: value });
  };

  const onRegisterClick = async () => {
    ssv.setOperatorKeys(inputsData.publicKey, inputsData.name);
    await ssv.verifyOperatorPublicKey().then((isExist) => {
      if (isExist) {
          setOperatorExist(true);
      } else {
        ssv.addNewOperator(true).then(() => {
          ssv.setIsLoading(false);
          history.push(config.routes.OPERATOR.CONFIRMATION_PAGE);
        });
      }
    });
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.OPERATOR.START} text="Join the SSV Network Operators" />
      <Header title={translations.OPERATOR.REGISTER.TITLE} subtitle={translations.OPERATOR.REGISTER.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <InputLabel title="Display Name">
            <TextInput
              data-testid="new-operator-name"
              className={displayNameError.shouldDisplay ? classes.inputError : ''}
              type="text"
              onBlur={(event) => { validateDisplayNameInput(event.target.value, setDisplayNameError); }}
              onChange={(event) => { onInputChange('name', event.target.value); }}
            />
            {displayNameError.shouldDisplay && <Typography className={classes.textError}>{displayNameError.errorMessage}</Typography>}
          </InputLabel>

          <br />
          <InputLabel title="Operator Key" withHint toolTipText={'this should be an hyperlinked'}>
            <TextInput type="text"
              data-testid="new-operator-key"
              className={publicKeyError.shouldDisplay ? classes.inputError : ''}
              onChange={(event) => { onInputChange('publicKey', event.target.value); }}
              onBlur={(event) => { validatePublicKeyInput(event.target.value, setPublicKeyError); }}
            />
            {publicKeyError.shouldDisplay && <Typography className={classes.textError}>{publicKeyError.errorMessage}</Typography>}
          </InputLabel>

          <br />
          {operatorExist && <MessageDiv text={'Operator already exists'} />}

          <Button
            data-testid="register-operator-button"
            disabled={!registerButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={onRegisterClick}
          >
            Next
          </Button>
          {ssv.addingNewOperator && <Backdrop />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(GenerateOperatorKeys);