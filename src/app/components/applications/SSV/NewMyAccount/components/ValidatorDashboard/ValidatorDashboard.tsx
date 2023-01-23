import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewMyAccount.styles';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';

const ValidatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  stores;

  const moveToRegisterValidator = () => {
    navigate(config.routes.SSV.VALIDATOR.HOME);
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <Grid container item xs style={{ cursor: 'pointer' }}>
          <Typography className={classes.Header} onClick={()=>changeState(2)}>Validator Cluster</Typography>
          <Grid className={classes.Arrow} />
        </Grid>
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={`${classes.HeaderButton} ${classes.lightHeaderButton}`}>
            Fee Address
          </Grid>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterValidator}>Add Cluster</Grid>
        </Grid>
      </Grid>
      <Dashboard
          body={[{ name: 'test1' }, { name: 'test2', tooltip: 'dsa' }, { name: 'test3' }]}
          headers={[
            { name: 'Cluster ID', tooltip: 'asdad' },
            { name: 'Operators' },
            { name: 'Validators' },
            { name: 'Operational Runway' },
          ]}
      />
    </Grid>
  );
};

export default observer(ValidatorDashboard);
