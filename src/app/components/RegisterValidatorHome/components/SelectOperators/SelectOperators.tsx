import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import ApplicationStore from '~app/common/stores/Application.store';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import OperatorSelector from './components/OperatorSelector';
import CTAButton from '~app/common/components/CTAButton';

const SelectOperators = () => {
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles();
  const registerButtonStyle = { width: '100%', marginTop: config.FEATURE.OPERATORS.AUTO_SELECT ? 146 : 100 };
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const { redirectUrl, history } = useUserFlow();

  useEffect(() => {
    unselectAllOperators();
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    setButtonEnabled(contractOperator.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!contractOperator.operators.length && !contractOperator.operatorsLoaded) {
      applicationStore.setIsLoading(true);
      contractOperator.loadOperators().then(() => {
        applicationStore.setIsLoading(false);
      });
    }
  }, [contractOperator.operators, contractOperator.selectedEnoughOperators]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.SLASHING_WARNING);
  };

  const unselectAllOperators = () => {
    contractOperator.unselectAllOperators();
  };

  return (
    <Paper className={classes.mainContainer}>
      <HistoryBackNavigation to={config.routes.VALIDATOR.DECRYPT} text={translations.VALIDATOR.IMPORT.TITLE} onClick={unselectAllOperators} />
      <Header title={translations.VALIDATOR.SELECT_OPERATORS.TITLE} subtitle={translations.VALIDATOR.SELECT_OPERATORS.DESCRIPTION} />

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
            <OperatorSelector key={`operator-selector-${operator.ownerAddress}`} indexedOperator={operator} dataTestId={`select-operator-${operatorIndex}`} />
          ))}

          <CTAButton
            testId={'operators-selected-button'}
            disable={!buttonEnabled}
            style={registerButtonStyle}
            onClick={onSelectOperatorsClick}
            text={'Next'}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(SelectOperators);
