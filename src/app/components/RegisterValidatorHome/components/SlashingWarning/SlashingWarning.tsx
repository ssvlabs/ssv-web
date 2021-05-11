import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import SsvStore from '~app/common/stores/Ssv.store';
import config, { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import BackNavigation from '~app/common/components/BackNavigation';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
  const wallet: WalletStore = stores.wallet;
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

  const onRegisterValidatorClick = async () => {
    await wallet.connect();
    await ssv.addNewValidator();
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.VALIDATOR.IMPORT} text="Import Validator" />
      <Header title={translations.VALIDATOR.SLASHING_WARNING.TITLE} subtitle={translations.VALIDATOR.SLASHING_WARNING.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>

          <OutlinedInput
            className={classes.wideWidthInput}
            data-testid="validator-private-key-slashing-input"
            type="text"
            value={ssv.validatorPrivateKey}
            endAdornment={(
              <Link href={`https://pyrmont.beaconcha.in/validator/${ssv.validatorPublicKey}`} target="_blank">
                <InputAdornment position="end" className={classes.inputAddonContainer}>
                  <img src="/images/etherscan.png" alt="Etherscan" className={classes.inputAddonImage} />
                </InputAdornment>
              </Link>
            )}
            labelWidth={0}
            readOnly
          />

          <br />
          <br />

          <Typography variant="subtitle1" style={{ fontSize: 13 }}>
            Running a validator simultaneously to the SSV network will cause slashing to your validator.
            <br />
            <br />
            To avoid slashing, shut down your existing validator setup before importing your validator to run with our network.
          </Typography>

          <Button
            disabled={!nextButtonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={onRegisterValidatorClick}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(SlashingWarning);
