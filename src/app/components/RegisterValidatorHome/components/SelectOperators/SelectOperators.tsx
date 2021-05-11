import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import OperatorSelector from './components/OperatorSelector';
import SsvStore, { IOperator } from '~app/common/stores/Ssv.store';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';

const SelectOperators = () => {
  const history = useHistory();
  const stores = useStores();
  const ssv: SsvStore = stores.ssv;
  const classes = useStyles();
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    setButtonEnabled(ssv.selectedEnoughOperators);

    // If no required information for this step - return to first screen
    if (!ssv.validatorPrivateKey && !ssv.validatorPrivateKeyFile) {
      history.push(config.routes.VALIDATOR.HOME);
      return;
    }
    if (!ssv.operators.length) {
      ssv.setIsLoading(true);
      ssv.loadOperators().then(() => {
        ssv.setIsLoading(false);
      });
    }
  }, [ssv.operators, ssv.selectedEnoughOperators]);

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
              disabled={!ssv.operators.length}
              variant="contained"
              color="primary"
              style={registerButtonStyle}
              onClick={ssv.autoSelectOperators}
            >
              <AutorenewIcon />
              &nbsp;Auto-select best operators
            </Button>
          ) : ''}

          {ssv.operators.slice(0, config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS).map((operator: IOperator) => (
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
