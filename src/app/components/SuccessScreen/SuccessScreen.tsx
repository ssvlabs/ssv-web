import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import OperatorStore from '~app/common/stores/Operator.store';
import ValidatorStore from '~app/common/stores/Validator.store';
import ConditionalLink from '~app/common/components/ConditionalLink';
import LinkButton from '~app/common/components/LinkButton/LinkButton';
import { useStyles } from '~app/components/SuccessScreen/SuccessScreen.styles';

const SuccessScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const operatorStore: OperatorStore = stores.Operator;
  const validatorStore: ValidatorStore = stores.Validator;
  let subTitle: any = '';
  let monitorHeader: string = '';
  let monitorText: string = '';
  let icon: string = '';

  if (operatorStore.newOperatorRegisterSuccessfully) {
    icon = 'success_operator_icon';
    subTitle = translations.SUCCESS.OPERATOR_DESCRIPTION;
    monitorHeader = 'Monitor Operator';
    monitorText = 'validatorStore your operator\'s prefomance and manage it in the account dashboard';
  } else if (validatorStore.newValidatorReceipt) {
    icon = 'success_validator_icon';
    subTitle = translations.SUCCESS.VALIDATOR_DESCRIPTION;
    monitorHeader = 'Monitor Validator';
    monitorText = 'View your validator performance in our explorer';
  }

  const redirectTo = () => {
    history.push(config.routes.MY_ACCOUNT.DASHBOARD);
  };

  return (
    <Screen
      // align
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
