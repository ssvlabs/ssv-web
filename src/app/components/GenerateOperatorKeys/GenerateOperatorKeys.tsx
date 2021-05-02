import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Backdrop from '~app/common/components/Backdrop';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import TextInput from '~app/common/components/TextInput';
import InputLabel from '~app/common/components/InputLabel';
import BackNavigation from '~app/common/components/BackNavigation';
import { INewOperatorTransaction } from '~app/common/stores/WalletStore';
import { useStyles } from '~app/components/Home/Home.styles';

const GenerateOperatorKeys = () => {
  const classes = useStyles();
  const { wallet } = useStores();
  const title = 'Register Operator';
  const subtitle = 'Register to the networks registry to enable others to discover and select you as one of their validator’s operators.';
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const checkboxLabelStyle = { fontSize: 14 };
  const [inputsData, setInputsData] = useState({ name: '', pubKey: '' });
  const [userAgreed, setUserAgreed] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);

  // Inputs validation
  // TODO: add validation of proper formats
  useEffect(() => {
    setRegisterButtonEnabled(!(!userAgreed || wallet.addingOperator || !inputsData.name || !inputsData.pubKey));
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData, userAgreed]);

  // Showing errors and success messages
  useEffect(() => {

  }, [wallet]);

  const onInputChange = (name: string, value: string) => {
    setInputsData({ ...inputsData, [name]: value });
  };

  const onRegisterClick = async () => {
    await wallet.connect()
      .then(() => {
        const transaction: INewOperatorTransaction = {
          name: inputsData.name,
          pubKey: inputsData.pubKey,
        };
        return wallet.registerOperator(transaction);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.OPERATOR.START} text="Join the SSV Network Operators" />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <InputLabel title="Display Name">
            <TextInput type="text" onChange={(event) => { onInputChange('name', event.target.value); }} />
          </InputLabel>

          <br />
          <InputLabel title="Operator Public Key">
            <TextInput type="text" onChange={(event) => { onInputChange('pubKey', event.target.value); }} />
          </InputLabel>

          <br />
          <FormControlLabel
            control={(
              <Checkbox
                checked={userAgreed}
                onChange={(event) => { setUserAgreed(event.target.checked); }}
                color="primary"
              />
            )}
            label={<Typography style={checkboxLabelStyle}>I have read and agree to the terms & conditions</Typography>}
            style={checkboxLabelStyle}
          />

          <Button
            disabled={!registerButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={onRegisterClick}
          >
            Register
          </Button>
          {wallet.addingOperator && <Backdrop />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(GenerateOperatorKeys);
