import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import { DropzoneArea } from 'material-ui-dropzone';
import SsvStore from '~app/common/stores/Ssv.store';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import BackNavigation from '~app/common/components/BackNavigation';

// TODO:
//  1. Create SSVStore to keep validator private key during the process
//  2. Cleanup SSVStore once the process is finished or route changed to other flows
//  3. Use SSVStore on further steps
const ImportValidator = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const ssv: SsvStore = stores.ssv;
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

  const goToSelectOperators = () => {
    if (ssv.validatorPrivateKeyFile) {
      history.push(config.routes.VALIDATOR.DECRYPT);
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
      <BackNavigation to={config.routes.VALIDATOR.HOME} text="Create Validator" />
      <Header title={translations.VALIDATOR.IMPORT.TITLE} subtitle={translations.VALIDATOR.IMPORT.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <br />
          <InputLabel title="Validator Private key">
            <DropzoneArea
              onChange={onFileChange}
              acceptedFiles={['.json']}
              filesLimit={1}
              maxFileSize={5000000}
            />
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
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(ImportValidator);
