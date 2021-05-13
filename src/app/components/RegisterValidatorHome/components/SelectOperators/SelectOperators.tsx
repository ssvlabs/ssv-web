import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Header from '~app/common/components/Header';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import ApplicationStore from '~app/common/stores/Application.store';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import OperatorSelector from './components/OperatorSelector';

const SelectOperators = () => {
  const history = useHistory();
  const stores = useStores();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const contractValidator: ContractValidator = stores.ContractValidator;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles();
  const registerButtonStyle = { width: '100%', marginTop: config.FEATURE.OPERATORS.AUTO_SELECT ? 146 : 100 };
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    setButtonEnabled(contractOperator.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!contractValidator.validatorPrivateKey && !contractValidator.validatorPrivateKeyFile) {
      history.push(config.routes.VALIDATOR.HOME);
      return;
    }
    if (!contractOperator.operators.length) {
      applicationStore.setIsLoading(true);
      contractOperator.loadOperators().then(() => {
        applicationStore.setIsLoading(false);
      });
    }
  }, [contractOperator.operators, contractOperator.selectedEnoughOperators]);

  const onSelectOperatorsClick = async () => {
    history.push(config.routes.VALIDATOR.SLASHING_WARNING);
  };

  return (
    <Paper className={classes.mainContainer}>
      <HistoryBackNavigation text={translations.VALIDATOR.IMPORT.TITLE} />
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

          {contractOperator.operators.slice(0, config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS).map((operator: IOperator) => (
            <OperatorSelector key={`operator-selector-${operator.pubkey}`} indexedOperator={operator} />
          ))}

          <Button
            disabled={!buttonEnabled}
            variant="contained"
            color="primary"
            style={registerButtonStyle}
            onClick={onSelectOperatorsClick}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(SelectOperators);
