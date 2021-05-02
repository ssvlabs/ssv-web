import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { IOperator } from '~app/common/stores/Validator.store';
import HistoryBackNavigation from '~app/common/components/HistoryBackNavigation';
import OperatorSelector from './components/OperatorSelector';
import { useStyles } from '~app/components/Home/Home.styles';

const SelectOperators = () => {
  const history = useHistory();
  const { validator } = useStores();
  const classes = useStyles();
  const title = translations.VALIDATOR.SELECT_OPERATORS.TITLE;
  const subtitle = translations.VALIDATOR.SELECT_OPERATORS.DESCRIPTION;
  const registerButtonStyle = { width: '100%', marginTop: 30 };

  useEffect(() => {
    // If no required information for this step - return to first screen
    if (!validator.validatorPrivateKey) {
      history.push(config.routes.VALIDATOR.HOME);
      return;
    }

    if (!validator.operators.length) {
      validator.loadAvailableOperators();
    }
  }, [validator]);

  const onSelectOperatorsClick = () => {

  };

  return (
    <Paper className={classes.mainContainer}>
      <HistoryBackNavigation text={translations.VALIDATOR.ENTER_KEY.TITLE} />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <br />

          {validator.operators.map((operator: IOperator) => (
            <OperatorSelector key={`operator-selector-${operator.publicKey}`} />
          ))}

          <Button
            disabled={false}
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
