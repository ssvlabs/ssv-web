import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStyles } from '../../NewWhiteWrapper.styles';

type Props = {
  header: string,
};

const ValidatorsFlow = (props: Props) => {
  const { header } = props;
  const navigate = useNavigate();
  const classes = useStyles({ mainFlow: false });

  const onNavigationClicked = async () => {
    navigate(-1);
  };

  return (
      <Grid container item>
        <Grid container item xs={10} style={{  alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Grid item className={classes.BackNavigation} onClick={onNavigationClicked} />
          <Grid item className={classes.HeaderText}>{header}</Grid>
          <Grid item className={classes.subHeaderText}>|</Grid>
          <Grid item className={classes.subHeaderText}>e3b0...b855</Grid>
        </Grid>
      </Grid>
  );
};

export default observer(ValidatorsFlow);
