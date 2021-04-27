import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Header from '~app/common/components/Header';
import TextInput from '~app/common/components/TextInput';
import InputLabel from '~app/common/components/InputLabel';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from '~app/components/NewOperator/NewOperator.styles';

const NewOperator = () => {
  const classes = useStyles();
  const title = 'Register Operator';
  const subtitle = 'Register to the networks registry to enable others to discover and select you as one of their validator’s operators.';
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  const checkboxLabelStyle = { fontSize: 14 };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to="/" text="Join the SSV Network Operators" />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <br />
          <InputLabel title="Display Name">
            <TextInput type="text" />
          </InputLabel>

          <br />
          <InputLabel title="Operator Key">
            <TextInput type="text" />
          </InputLabel>

          <br />
          <FormControlLabel
            control={(
              <Checkbox
                onChange={(event) => { console.warn('Changed checkbox', event); }}
                color="primary"
              />
            )}
            label={<Typography style={checkboxLabelStyle}>I have read and agree to the terms & conditions</Typography>}
            style={checkboxLabelStyle}
          />

          <Button
            variant="contained"
            color="primary"
            style={registerButtonStyle}>
            Register
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(NewOperator);
