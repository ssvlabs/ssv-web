import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import Spinner from '~app/common/components/Spinner';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Home/Home.styles';
import OperatorSelector from './components/OperatorSelector';
import SSVStore, { IOperator } from '~app/common/stores/SSV.store';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';

const SelectOperators = () => {
  const history = useHistory();
  const stores = useStores();
  const ssv: SSVStore = stores.ssv;
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
      ssv.loadOperators();
    }
  }, [ssv.operators, ssv.selectedEnoughOperators]);

  const onSelectOperatorsClick = async () => {
    await ssv.addNewValidator();
  };

  return (
    <Paper className={classes.mainContainer}>
      <HistoryBackNavigation text={translations.VALIDATOR.ENTER_KEY.TITLE} />
      <Header title={translations.VALIDATOR.SELECT_OPERATORS.TITLE} subtitle={translations.VALIDATOR.SELECT_OPERATORS.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>

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

          {!ssv.loadingOperators ?
            ssv.operators.map((operator: IOperator) => (
              <OperatorSelector key={`operator-selector-${operator.publicKey}`} indexedOperator={operator} />
            ))
          : (
            <>
              <br />
              <br />
              <Spinner message="Loading operators list.." />
            </>
          )}

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
