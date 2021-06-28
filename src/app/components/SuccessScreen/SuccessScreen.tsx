import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
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
  const contractValidator: ContractValidator = stores.ContractValidator;
  let subTitle: any = '';
  let monitorHeader: string = '';
  let monitorText: string = '';

  if (contractOperator.newOperatorRegisterSuccessfully) {
    subTitle = translations.SUCCESS.OPERATOR_DESCRIPTION;
    monitorHeader = 'Monitor Node';
    monitorText = 'View your operator performance in our explorer';
  } else if (contractValidator.newValidatorReceipt) {
    subTitle = translations.SUCCESS.VALIDATOR_DESCRIPTION;
    monitorHeader = 'Monitor Validator';
    monitorText = 'View your validator performance in our explorer';
  }

  return (
    <Screen
      icon={'/images/checked.svg'}
      align
      title={translations.SUCCESS.TITLE}
      subTitle={subTitle}
      body={(
        <Grid className={classes.gridContainer} container spacing={5}>
          <Grid item xs>
            <ConditionalLink to={config.routes.OPERATOR.GENERATE_KEYS} condition={false} onClick={(() => { })}>
              <LinkButton primaryLabel={monitorHeader} secondaryLabel={monitorText} />
            </ConditionalLink>
          </Grid>
        </Grid>
      )}
    />
  );
};

export default observer(SuccessScreen);
