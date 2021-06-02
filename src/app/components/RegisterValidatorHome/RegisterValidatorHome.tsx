import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import Typography from '@material-ui/core/Typography';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import ConditionalLink from '~app/common/components/ConditionalLink';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

const RegisterValidatorHome = () => {
  const classes = useStyles();
  const stores = useStores();
  const history = useHistory();
  const { setUserFlow } = useUserFlow();
  const walletStore: WalletStore = stores.Wallet;

  const redirectTo = async (route: string) => {
    await walletStore.connect();
    if (walletStore.connected) {
      setUserFlow(route);
      history.push(route);
    }
  };

  return (
    <Paper className={classes.mainContainer}>
      <Header title={translations.VALIDATOR.HOME.TITLE} subtitle={translations.VALIDATOR.HOME.DESCRIPTION} />
      <br />
      <Grid container wrap="nowrap" spacing={3} className={classes.rowGridContainer}>
        <Grid item xs={6} md={6} zeroMinWidth className={classes.rowGridContainer}>
          <ConditionalLink to={config.routes.VALIDATOR.CREATE} condition onClick={() => redirectTo(config.routes.VALIDATOR.CREATE)}>
            <Paper>
              <Grid container wrap="nowrap" className={classes.bigSquareButton}>
                <Grid item md={12} xs={12} className={classes.bigSquareButtonGrid}>
                  <img src="/images/etherium.png" alt="Create Validator" className={classes.bigSquareButtonIcon} />
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Create Validator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </ConditionalLink>
        </Grid>

        <Grid item xs={6} md={6} zeroMinWidth className={classes.rowGridContainer}>
          <ConditionalLink to={config.routes.VALIDATOR.IMPORT} condition={walletStore.connected} onClick={() => redirectTo(config.routes.VALIDATOR.IMPORT)}>
            <Paper>
              <Grid container wrap="nowrap" className={classes.bigSquareButton}>
                <Grid item md={12} xs={12} className={classes.bigSquareButtonGrid}>
                  <img src="/images/etherium.png" alt="Import Validator" className={classes.bigSquareButtonIcon} />
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Import Validator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </ConditionalLink>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default observer(RegisterValidatorHome);
