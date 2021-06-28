import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import ApplicationStore from '~app/common/stores/Application.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import OperatorSelector from './components/OperatorSelector';

const SelectOperators = () => {
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles();
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    unselectAllOperators();
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    setButtonEnabled(contractOperator.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!contractOperator.operators.length && !contractOperator.operatorsLoaded && !contractOperator.loadingOperator) {
      applicationStore.setIsLoading(true);
      contractOperator.loadOperators().then(() => {
        applicationStore.setIsLoading(false);
      });
    }
  }, [contractOperator.operators, contractOperator.selectedEnoughOperators, contractOperator.loadingOperator]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.SLASHING_WARNING);
  };

  const unselectAllOperators = () => {
    contractOperator.unselectAllOperators();
  };

  return (
    <Screen
      navigationText={translations.VALIDATOR.IMPORT.TITLE}
      navigationLink={config.routes.VALIDATOR.DECRYPT}
      navigationOnClick={unselectAllOperators}
      title={translations.VALIDATOR.SELECT_OPERATORS.TITLE}
      subTitle={translations.VALIDATOR.SELECT_OPERATORS.DESCRIPTION}
      body={(
        <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
          <Grid item xs zeroMinWidth className={classes.gridContainer}>
            {config.FEATURE.OPERATORS.AUTO_SELECT ? (
              <Button
                disabled={!contractOperator.operators.length}
                variant="contained"
                color="primary"
                style={{ width: '100%' }}
                onClick={contractOperator.autoSelectOperators}
                      >
                <AutorenewIcon />
                        &nbsp;Auto-select
              </Button>
            ) : ''}

            {contractOperator.operators.slice(0, config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS).map((operator: IOperator, operatorIndex: number) => (
              <OperatorSelector key={`operator-selector-${operatorIndex}`} indexedOperator={operator} dataTestId={`select-operator-${operatorIndex}`} />
            ))}
          </Grid>
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId={'operators-selected-button'}
          disable={!buttonEnabled}
          onClick={onSelectOperatorsClick}
          text={'Next'}
        />
      )}
    />
  );
};

export default observer(SelectOperators);
