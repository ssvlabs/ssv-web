import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ConditionalLink from '~app/common/components/ConditionalLink';
import LinkButton from '~app/common/components/LinkButton/LinkButton';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

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
    <Screen
      navigationText={translations.HOME.TITLE}
      navigationLink={config.routes.HOME}
      title={translations.VALIDATOR.HOME.TITLE}
      subTitle={translations.VALIDATOR.HOME.DESCRIPTION}
      body={(
        <Grid container wrap="nowrap" spacing={3} className={classes.columnGridContainer}>
          <Grid item xs={12} md={12} zeroMinWidth className={classes.columnGridContainer}>
            <ConditionalLink to={config.routes.VALIDATOR.CREATE} condition onClick={() => redirectTo(config.routes.VALIDATOR.CREATE)}>
              <LinkButton primaryLabel={'Create Validator'} secondaryLabel={''} icon={'images/create_validator_icon.svg'} />
            </ConditionalLink>
          </Grid>
          <Grid item xs={12} md={12} zeroMinWidth className={classes.columnGridContainer}>
            <ConditionalLink to={config.routes.VALIDATOR.IMPORT} condition={walletStore.connected} onClick={() => redirectTo(config.routes.VALIDATOR.IMPORT)}>
              <LinkButton primaryLabel={'Import Validator'} secondaryLabel={''} icon={'images/import_validator_icon.svg'} />
            </ConditionalLink>
          </Grid>
        </Grid>
      )}
    />
  );
};

export default observer(RegisterValidatorHome);
