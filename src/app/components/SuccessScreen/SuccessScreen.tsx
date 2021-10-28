import React, { useEffect } from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ConditionalLink from '~app/common/components/ConditionalLink';
import LinkButton from '~app/common/components/LinkButton/LinkButton';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';

const SuccessScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const contractOperator: ContractOperator = stores.ContractOperator;
  const walletStore: WalletStore = stores.Wallet;
  const contractValidator: ContractValidator = stores.ContractValidator;
  let subTitle: any = '';
  let monitorHeader: string = '';
  let monitorText: string = '';
  let icon: string = '';
  let explorerLink: string = '';

  if (contractOperator.newOperatorRegisterSuccessfully) {
    icon = 'success_operator_icon';
    subTitle = translations.SUCCESS.OPERATOR_DESCRIPTION;
    monitorHeader = 'Monitor Node';
    monitorText = 'View your operator performance in our explorer';
    explorerLink = `${config.links.LINK_EXPLORER}/operators/${sha256(walletStore.decodeOperatorKey(contractOperator.newOperatorKeys.pubKey))}`;
  } else if (contractValidator.newValidatorReceipt) {
    icon = 'success_validator_icon';
    subTitle = translations.SUCCESS.VALIDATOR_DESCRIPTION;
    monitorHeader = 'Monitor Validator';
    monitorText = 'View your validator performance in our explorer';
    explorerLink = `${config.links.LINK_EXPLORER}/validators/${contractValidator.validatorPublicKey}`;
  }

  const redirectTo = () => {
    window.open(explorerLink);
  };

  return (
    <Screen
      align
      title={translations.SUCCESS.TITLE}
      subTitle={subTitle}
      body={(
        <Grid className={classes.gridContainer} container spacing={0}>
          <Grid item xs={12} className={classes.successImage}>
            <img src={getImage(`${icon}.svg`)} className={classes.icon} />
          </Grid>
          <Grid item xs={12} className={classes.linkWrapper}>
            <ConditionalLink to={config.routes.OPERATOR.GENERATE_KEYS} condition={false} onClick={redirectTo}>
              <LinkButton primaryLabel={monitorHeader} secondaryLabel={monitorText} />
            </ConditionalLink>
          </Grid>
        </Grid>
      )}
    />
  );
};

export default observer(SuccessScreen);
