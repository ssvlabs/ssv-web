import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import SSVStore from '~app/common/stores/SSV.store';
import config, { translations } from '~app/common/config';
import TextInput from '~app/common/components/TextInput';
// import FileInput from '~app/common/components/FileInput';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Home/Home.styles';
import BackNavigation from '~app/common/components/BackNavigation';

// TODO:
//  1. Create SSVStore to keep validator private key during the process
//  2. Cleanup SSVStore once the process is finished or route changed to other flows
//  3. Use SSVStore on further steps
const EnterValidatorPrivateKey = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const ssv: SSVStore = stores.ssv;
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  // Inputs validation
  // TODO: add validation of proper formats
  useEffect(() => {
    setNextButtonEnabled(!!ssv.validatorPrivateKey || !!ssv.validatorPrivateKeyFile);
    return () => {
      setNextButtonEnabled(false);
    };
  }, [ssv.validatorPrivateKey, ssv.validatorPrivateKeyFile]);

  const onInputChange = (value: string) => {
    ssv.setValidatorPrivateKey(value);
  };

  const goToSelectOperators = () => {
    if (ssv.validatorPrivateKeyFile) {
      history.push(config.routes.VALIDATOR.FILE_PASSWORD_APPROVAL);
    } else {
      history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    }
  };
  const onFileChange = (file: any) => {
    if (file !== null) {
      ssv.setValidatorPrivateKeyFile(file[0]);
    }
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.OPERATOR.HOME} text="Join SSV Network" />
      <Header title={translations.VALIDATOR.ENTER_KEY.TITLE} subtitle={translations.VALIDATOR.ENTER_KEY.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <br />
          <InputLabel title="Validator Private key">
            <TextInput className={classes.privateKeyTextInput} type="text" value={ssv.validatorPrivateKey} onChange={(event) => { onInputChange(event.target.value); }} />
            <DropzoneArea
              onChange={onFileChange}
              // open={this.state.open}
              // onSave={this.handleSave.bind(this)}
              acceptedFiles={['.json']}
              // showPreviews
              filesLimit={1}
              maxFileSize={5000000}
              // onClose={this.handleClose.bind(this)}
            />
            {/* <FileInput type="file" onChange={(event) => { onFileChange(event.target.files || null); }}> */}
            {/* </FileInput> */}
          </InputLabel>

          <Button
            disabled={!nextButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={goToSelectOperators}
          >
            Next
          </Button>
          <Typography style={{ textAlign: 'center', fontSize: 12, marginTop: 30 }}>I don’t have a validator key</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(EnterValidatorPrivateKey);
