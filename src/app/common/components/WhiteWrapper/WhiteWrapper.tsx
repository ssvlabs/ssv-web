import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './WhiteWrapper.styles';
import Typography from '@material-ui/core/Typography';

const WhiteWrapper = ({ children, header, withCancle = true }: any) => {
    console.log(children);
    console.log(header);
    const classes = useStyles();

    return (
      <Grid container item className={classes.WhiteWrapper}>
        {header && (
        <Grid container item xs={12} alignItems={'center'}>
          <Grid item xs={6} className={classes.HeaderWrapper}>
            <Typography>{header}</Typography>
          </Grid>
          {withCancle && (
          <Grid item xs={6}>
            <Grid container item className={classes.CancelWrapper}>
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
