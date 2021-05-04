import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import SSVStore from '~app/common/stores/SSV.store';
import config, { translations } from '~app/common/config';
import TextInput from '~app/common/components/TextInput';
// import FileInput from '~app/common/components/FileInput';
import InputLabel from '~app/common/components/InputLabel';
import { useStyles } from '~app/components/Home/Home.styles';
import BackNavigation from '~app/common/components/BackNavigation';
// import FileInput from '~app/common/components/FileInput';

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

    useEffect(() => {
        // If no required information for this step - return to first screen
        if (!ssv.validatorPrivateKeyFile) {
            history.push(config.routes.VALIDATOR.HOME);
        }
    }, [ssv.validatorPrivateKeyFile]);

    useEffect(() => {
        console.log(ssv.validatorKeyStorePassword);
        setNextButtonEnabled(!!ssv.validatorKeyStorePassword);
        return () => {
            setNextButtonEnabled(false);
        };
    }, [ssv.validatorKeyStorePassword]);

    const onInputChange = (value: string) => {
        ssv.setValidatorKeyStorePassword(value);
    };
    const goToSelectOperators = () => {
        history.push(config.routes.VALIDATOR.SELECT_OPERATORS);
    };
    const removeKeyStoreFile = () => {
        ssv.setValidatorPrivateKeyFile(false);
    };

    return (
      <Paper className={classes.mainContainer}>
        <BackNavigation to={config.routes.OPERATOR.HOME} text="Join SSV Network" />
        <Header title={translations.VALIDATOR.ENTER_KEY.TITLE} subtitle={translations.VALIDATOR.ENTER_KEY.SECURITY_DESCRIPTION} />

        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <br />
            <br />
            <InputLabel title="Keystore File">
              {/* here should be Square with file name and icon and cancle option */}
              <Grid container className={classes.fileContainer}>
                <Grid item xs={1}>
                  <DoneIcon className={classes.doneIcon} />
                </Grid>
                <Grid className={classes.fileNameText} item xs={8}>
                  {ssv.validatorPrivateKeyFile && ssv.validatorPrivateKeyFile.name}
                </Grid>
                <Grid item xs={3}>
                  <ClearIcon onClick={removeKeyStoreFile} className={classes.clearIcon} />
                </Grid>
              </Grid>
              {/* <Typography className={classes.fileContainer}> */}
              {/*  <DoneIcon /> */}
              {/*  {ssv.validatorPrivateKeyFile?.name} */}
              {/*  <ClearIcon /> */}
              {/* </Typography> */}
            </InputLabel>

            <InputLabel title="Keystore Password">
              <TextInput type="text" value={ssv.validatorKeyStorePassword} onChange={(event) => { onInputChange(event.target.value); }} />
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
