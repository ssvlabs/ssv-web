import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Backdrop from '~app/common/components/Backdrop';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import TextInput from '~app/common/components/TextInput';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Home/Home.styles';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';

const SelectOperators = () => {
  const classes = useStyles();
  const { wallet } = useStores();
  const title = 'Register Validator to SSV Network';
  const subtitle = 'To join the network of operators you must run an SSV node. Setup your node, generate operator keys and register to the network.';
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const [inputsData, setInputsData] = useState({ validatorPrivateKey: '' });
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);

  // Inputs validation
  // TODO: add validation of proper formats
  useEffect(() => {
    setRegisterButtonEnabled(!!inputsData.validatorPrivateKey);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData]);

  // TODO: Show errors and success messages
  useEffect(() => {

  }, [wallet]);

  const onInputChange = (name: string, value: string) => {
    setInputsData({ ...inputsData, [name]: value });
  };

  const onSelectOperatorsClick = () => {

  };

  return (
    <Paper className={classes.mainContainer}>
      <HistoryBackNavigation text="Register Validator to SSV Network" />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <br />
          <InputLabel title="Validator Private key">
            <TextInput type="text" onChange={(event) => { onInputChange('validatorPrivateKey', event.target.value); }} />
          </InputLabel>

          <Button
            disabled={!registerButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={onSelectOperatorsClick}
          >
            Next
          </Button>
          <br />
          <br />
          <Typography style={{ textAlign: 'center', fontSize: 12 }}>I don’t have a validator key</Typography>
          {wallet.addingOperator && <Backdrop />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(SelectOperators);
