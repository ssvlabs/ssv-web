import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { Link as MaterialLink } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import LinkButton from '~app/common/components/LinkButton';
import UnStyledLink from '~app/common/components/UnStyledLink';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ConditionalLink from '~app/common/components/ConditionalLink';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const OrganicLink = UnStyledLink(MaterialLink);

const RegisterOperatorHome = () => {
  const classes = useStyles();
  const history = useHistory();
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  const redirectToGenerateKeys = async () => {
     await walletStore.connect();
     if (walletStore.connected) {
      history.push(config.routes.OPERATOR.GENERATE_KEYS);
    }
  };

  return (
    <Screen 
      navigationText={translations.HOME.TITLE}
      navigationLink={config.routes.HOME}
      title={translations.OPERATOR.HOME.TITLE}
      subTitle={translations.OPERATOR.HOME.DESCRIPTION}
      body={(
        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <OrganicLink href={config.links.LINK_SSV_DEV_DOCS} target="_blank">
              <LinkButton primaryLabel={'Run SSV Node'} secondaryLabel={'See our developer documentation'} />
            </OrganicLink>
          </Grid>

          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            <ConditionalLink to={config.routes.OPERATOR.GENERATE_KEYS} condition={walletStore.connected} onClick={redirectToGenerateKeys}>
              <LinkButton primaryLabel={'Register operator'} secondaryLabel={'List yourself as one of the network operators'} />
            </ConditionalLink>
          </Grid>
        </Grid>
      )}
    />
  );
};

export default observer(RegisterOperatorHome);
