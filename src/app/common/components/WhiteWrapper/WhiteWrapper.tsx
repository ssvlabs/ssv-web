import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useStyles } from './WhiteWrapper.styles';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';

const WhiteWrapper = ({ children, header, withCancle = true }: any) => {
    const classes = useStyles();
    const history = useHistory();

    const cancelProcess = () => {
        history.push(config.routes.MY_ACCOUNT.DASHBOARD);
    };

    return (
      <Grid container item className={classes.WhiteWrapper}>
        {header && (
        <Grid container item xs={12} alignItems={'center'}>
          <Grid item xs={6} className={classes.HeaderWrapper}>
            <Typography>{header}</Typography>
          </Grid>
          {withCancle && (
          <Grid item xs={6}>
            <Grid container item className={classes.CancelWrapper} onClick={cancelProcess}>
              <Typography>Cancel</Typography>
              <Grid item className={classes.CancelImage} />
            </Grid>
          </Grid>
          )}
        </Grid>
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    );
};
export default observer(WhiteWrapper);
